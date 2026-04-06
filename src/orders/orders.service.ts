import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from './services/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from '../config';
import { firstValueFrom } from 'rxjs';
import { OrderPaginationDto } from './dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    try {
      // 1. Extract product IDs
      const productIds = createOrderDto.orderDetail.map(detail => detail.productId);

      // 2. Fetch validated products from Products MS
      const products: any[] = await firstValueFrom(
        this.productsClient.send({ cmd: 'validate_products' }, productIds)
      );

      // 3. Calculate total Amount and construct detail map
      const totalAmount = createOrderDto.orderDetail.reduce((acc, orderItem) => {
        const product = products.find(p => p.id === orderItem.productId);
        return acc + (product.price * orderItem.quantity);
      }, 0);

      const totalItems = createOrderDto.orderDetail.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      // 4. Create the Prisma Transaction or standard insertion
      const order = await this.prisma.order.create({
        data: {
          totalAmount: totalAmount,
          totalItems: totalItems,
          // If status isn't provided, Prisma or DTO default should be used, or just pass it if it's there
          // status: createOrderDto.status, // Uncomment if you still receive status from client
          orderDetail: {
            create: createOrderDto.orderDetail.map(detail => ({
              productId: detail.productId,
              quantity: detail.quantity,
              price: products.find(p => p.id === detail.productId).price,
            })),
          },
        },
      });

      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const { page, limit, status } = orderPaginationDto;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { status: orderPaginationDto.status },
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.prisma.order.count({
        where: { status: orderPaginationDto.status }
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: totalPages,
      }
    };
  }

  async findAllByStatus(orderPaginationDto: OrderPaginationDto) {
    const { page, limit, status } = orderPaginationDto;

    const [total, data] = await Promise.all([
      this.prisma.order.count({
        where: { status: status }
      }),
      this.prisma.order.findMany({
        where: { status: status },
        skip: (page - 1) * limit,
        take: limit,
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: totalPages,
      }
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: id },
    });

    if (!order) {
      throw new RpcException({ status: HttpStatus.NOT_FOUND, message: `Order with id ${id} not found` });
    }

    return order;
  }

  async changeOrderStatus(updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: updateOrderStatusDto.id }
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${updateOrderStatusDto.id} not found`
      });
    }

    if (order.status === updateOrderStatusDto.status) {
      return order;
    }

    return this.prisma.order.update({
      where: { id: updateOrderStatusDto.id },
      data: { status: updateOrderStatusDto.status }
    });
  }
}

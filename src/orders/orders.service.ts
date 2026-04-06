import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from './services/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly prisma: PrismaService) { }

  create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: createOrderDto,
    });
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

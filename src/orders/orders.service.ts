import { Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from './services/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly prisma: PrismaService) { }

  create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: createOrderDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.prisma.order.count(),
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

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id: id },
    });
  }

  changeOrderStatus() {
    return 'This action changes the status of an order';
  }
}

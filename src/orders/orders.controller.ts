import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { OrderPaginationDto } from './dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    console.log('Entry MS controller - Create order');
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern('findAllOrders')
  findAll(@Payload() orderPaginationDto: OrderPaginationDto) {
    console.log('Entry MS controller - Find all orders');
    return this.ordersService.findAll(orderPaginationDto);
  }

  @MessagePattern('findAllOrdersByStatus')
  findAllByStatus(@Payload() orderPaginationDto: OrderPaginationDto) {
    console.log('Entry MS controller - Find all orders by status');
    return this.ordersService.findAllByStatus(orderPaginationDto);
  }

  @MessagePattern('findOneOrder')
  findOne(@Payload() id: string) {
    console.log('Entry MS controller - Find one order');
    return this.ordersService.findOne(id);
  }

  @MessagePattern('changeOrderStatus')
  changeOrderStatus(@Payload() id: number) {
    return this.ordersService.changeOrderStatus();
  }
}

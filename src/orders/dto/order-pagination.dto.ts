import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { OrderStatus } from "@prisma/client";
import { OrderStatusList } from "../enums/order.enum";

export class OrderPaginationDto extends PaginationDto {
    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `Order status must be one of: ${OrderStatusList.join(', ')}`
    })
    status: OrderStatus;
}
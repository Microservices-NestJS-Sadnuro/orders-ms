import { IsEnum, IsOptional } from "class-validator";
import { OrderStatusList } from "../enums/order.enum";
import { OrderStatus } from "generated/prisma";

export class StatusDto {
    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `Invalid status. Valid values are: ${OrderStatusList.join(', ')}`
    })
    status: OrderStatus;
}
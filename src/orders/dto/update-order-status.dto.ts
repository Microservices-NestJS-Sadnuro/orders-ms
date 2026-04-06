import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { OrderStatusList } from "../enums/order.enum";
import { OrderStatus } from "@prisma/client";

export class UpdateOrderStatusDto {
    @IsUUID()
    id: string;

    @IsEnum(OrderStatusList, {
        message: `Status must be one of ${OrderStatusList.join(', ')}`
    })
    status: OrderStatus;
}
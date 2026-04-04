import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive } from "class-validator";
import { OrderStatus } from "@prisma/client";
import { OrderStatusList } from "../enums/order.enum";

export class CreateOrderDto {
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    totalAmount: number;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    totalItems: number;

    @IsEnum(OrderStatusList, {
        message: `Status must be one of ${OrderStatusList.join(', ')}`
    })
    @IsOptional()
    status: OrderStatus = OrderStatus.PENDING;

    @IsBoolean()
    @IsOptional()
    paid: boolean = false;

    // @IsDate()
    // @Type(() => Date)
    // paidAt: Date;
}

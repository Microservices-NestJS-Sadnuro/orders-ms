import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive, ValidateNested } from "class-validator";
import { OrderStatus } from "@prisma/client";
import { OrderStatusList } from "../enums/order.enum";
import { CreateOrderDetailDto } from "./create-order-detail.dto";

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

    @ValidateNested({ each: true })
    @Type(() => CreateOrderDetailDto)
    orderDetail: CreateOrderDetailDto[];

}

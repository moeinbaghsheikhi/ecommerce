import { IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { OrderStatus } from "../enums/order-status.enum";
import { Type } from "class-transformer";
import { CreateOrderItemDto } from "./craete-order-item.dto";

export class CreateOrderDto {
    @IsNumber({}, { message: 'شناسه کاربر باید یک عدد باشد' })
    userId: number;

    @IsEnum(OrderStatus, { message: 'وضعیت سفارش باید یکی از مقادیر معتبر باشد' })
    @IsOptional()
    status?: OrderStatus;

    @IsDateString({}, { message: 'زمان پرداخت باید یک تاریخ معتبر باشد' })
    @IsOptional()
    payed_time?: Date;

    @IsNumber({}, { message: 'شناسه آدرس باید یک عدد باشد' })
    addressId: number;

    @IsNumber({}, { message: 'قیمت کل باید یک عدد باشد' })
    total_price: number;

    @IsString({ message: 'کد تخفیف باید یک متن باشد' })
    @IsOptional()
    discount_code?: string;

    @IsArray({ message: 'آیتم‌های سفارش باید به صورت آرایه ارسال شوند' })
    @ValidateNested({ each: true, message: 'هر آیتم سفارش باید معتبر باشد' })
    @Type(() => CreateOrderItemDto) 
    items: CreateOrderItemDto[];
}
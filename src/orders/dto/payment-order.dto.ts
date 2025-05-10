import { IsNumber, IsNotEmpty } from 'class-validator';

export class paymentOrderDto {
    @IsNumber()
    @IsNotEmpty({ message: 'آیدی سفارش نمی‌تواند خالی باشد' })
    order_id: number;
}
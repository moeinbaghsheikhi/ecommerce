import { IsNumber, IsNotEmpty } from 'class-validator';

export class verifyPayment {
    @IsNumber()
    @IsNotEmpty({ message: 'کد تراکنش نمی‌تواند خالی باشد' })
    trackId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'آیدی سفارش نمی‌تواند خالی باشد' })
    order_id: number;
}
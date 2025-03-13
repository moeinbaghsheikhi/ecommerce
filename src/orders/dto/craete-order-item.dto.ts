import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
    @IsNumber()
    @IsNotEmpty({ message: 'شناسه محصول نمی‌تواند خالی باشد' })
    productId: number;
}
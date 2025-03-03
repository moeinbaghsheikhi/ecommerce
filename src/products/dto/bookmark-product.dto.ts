import { IsNotEmpty, IsNumber, IsInt } from 'class-validator';

export class BookmarkProductDto {
    @IsNotEmpty({ message: 'شناسه محصول نمی‌تواند خالی باشد' })
    @IsNumber({}, { message: 'شناسه محصول باید یک عدد باشد' })
    @IsInt({ message: 'شناسه محصول باید یک عدد صحیح باشد' })
    product_id: number;

    @IsNotEmpty({ message: 'شناسه کاربر نمی‌تواند خالی باشد' })
    @IsNumber({}, { message: 'شناسه کاربر باید یک عدد باشد' })
    @IsInt({ message: 'شناسه کاربر باید یک عدد صحیح باشد' })
    user_id: number;
}
import { IsString, IsInt, IsOptional, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsInt()
  price: number;

  @IsString()
  description: string;

  @IsInt()
  stock: number;

  @IsOptional()
  @IsArray()
  categoryIds?: number[];
}
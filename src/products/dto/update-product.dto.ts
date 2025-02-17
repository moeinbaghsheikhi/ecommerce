import { IsArray, IsInt, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsInt()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsInt()
  @IsOptional()
  stock: number;

  @IsOptional()
  @IsArray()
  categoryIds?: number[];
}

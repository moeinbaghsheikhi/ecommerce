import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Category } from "../categories/entities/category.entity";
import { UsersModule } from 'src/users/users.module';
import { BookmarkProduct } from './entities/product-bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, BookmarkProduct]), UsersModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}

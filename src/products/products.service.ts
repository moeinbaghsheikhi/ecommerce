import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { In, Repository } from "typeorm";
import { Category } from "../categories/entities/category.entity";
import { BookmarkProduct } from "./entities/product-bookmark.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(BookmarkProduct)
    private readonly bookmarkProductRepository: Repository<BookmarkProduct>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly userService : UsersService
  ) {}
  async create(createProductDto: CreateProductDto):Promise<Product> {
    const { title, price, description, stock, categoryIds } = createProductDto;

    const product = await this.productsRepository.create({ title, price, description, stock });

    if(categoryIds) {
      const categories = await this.categoryRepository.findBy({ id: In(categoryIds) })
      product.categories = categories;
    }

    return await this.productsRepository.save(product);
  }

  async update(id: number, updateProductDto :UpdateProductDto){
    const { title, price, description, stock, categoryIds } = updateProductDto;

    const product: Product = await this.findOne(id);

    if(title) product.title = title;
    if(price) product.price = price;
    if(description) product.description = description;
    if(stock) product.stock = stock;

    if(categoryIds){
      const categories =  await this.categoryRepository.findBy({ id: In(categoryIds) })
      product.categories = categories;
    }

    return await this.productsRepository.save(product);
  }

  async findAll() :Promise<Product[]> {
    return await this.productsRepository.find({ relations: ["categories"] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id }, relations: ["categories"] });
    if(!product) throw new NotFoundException("Product not found");
    return product;
  }

  async toggleBookmark(userId: number, productId: number): Promise<BookmarkProduct | void> {
    // چک کردن وجود کاربر و محصول
    const user = await this.userService.findOne(userId);
    const product = await this.productsRepository.findOne({ where: { id: productId } });

    if (!user || !product) {
        throw new NotFoundException('کاربر یا محصول یافت نشد');
    }

    // چک کردن وجود بوکمارک
    const existingBookmark = await this.bookmarkProductRepository.findOne({
      where: { 
          user: { id: user.id }, // فقط id کاربر
          product: { id: product.id }, // فقط id محصول
      },
  });
    console.log(existingBookmark)

    if (existingBookmark) {
        // اگر بوکمارک وجود داشت، حذف می‌کنیم
        await this.bookmarkProductRepository.remove(existingBookmark);
    } else {
        // اگر بوکمارک وجود نداشت، ایجاد می‌کنیم
        const newBookmark = this.bookmarkProductRepository.create({
            user: user,
            product: product,
        });
        return await this.bookmarkProductRepository.save(newBookmark);
    }
  }

  async addItemToBasket(userId: number, productId: number): Promise<void> {
    const product = await this.productsRepository.findOne({ where: { id: productId } });

    await this.userService.addProductToBasket(userId, product);
  }

  async removeItemFromBasket(userId: number, productId: number) {
    const product = await this.productsRepository.findOne({ where: { id: productId } });

    return await this.userService.removeProductFromBasket(userId, product);
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { In, Repository } from "typeorm";
import { Category } from "../categories/entities/category.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
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
}

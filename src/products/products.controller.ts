import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Put } from "@nestjs/common";
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from "express";
import { BookmarkProductDto } from "./dto/bookmark-product.dto";

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Res() res: Response) {
    const product = await this.productsService.create(createProductDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: product,
      message: " محصول با موفقیت ساخته شد"
    })
  }

  @Post('bookmark-prodcut')
  async bookmarkProduct(@Body() bookmarkProduct: BookmarkProductDto, @Res() res: Response){
    const bookmarkData = await this.productsService.toggleBookmark(bookmarkProduct.user_id, bookmarkProduct.product_id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: bookmarkData,
      message: " محصول با موفقیت ذخیره شد"
    })
  }

  @Post('add-basket')
  async addItemToBasket(@Body() bookmarkProduct: BookmarkProductDto, @Res() res: Response){
    const bookmarkData = await this.productsService.addItemToBasket(bookmarkProduct.user_id, bookmarkProduct.product_id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: bookmarkData,
      message: " محصول با موفقیت به سبد خرید اضافه شد"
    })
  }

  @Post('remove-basket')
  async removeItemFromBasket(@Body() bookmarkProduct: BookmarkProductDto, @Res() res: Response){
    await this.productsService.removeItemFromBasket(bookmarkProduct.user_id, bookmarkProduct.product_id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: " محصول با موفقیت از سبد حذف اضافه شد"
    })
  }

  @Get()
  async findAll(@Res() res: Response) {
    const products = await this.productsService.findAll();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: products,
      message: "لیست محصولات با موفقیت دریافت شد"
    })
  }

  @Get(':id')
  async findOne(@Param('id') id: string,@Res() res: Response) {
    const product = await this.productsService.findOne(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: product,
      message: " محصول شما با موفقیت دریافت شد"
    })
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Res() res: Response) {
    const product = await this.productsService.update(+id, updateProductDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: product,
      message: "محصول با موفقیت آپدیت شد"
    })
  }
}

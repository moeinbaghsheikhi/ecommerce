import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from "@nestjs/common";
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Response } from "express";

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @Res() res: Response) {
    const category = await this.categoriesService.create(createCategoryDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: category,
      message: "دسته بندی با موفقیت ساخته شد"
    })
  }

  @Get()
  async findAll(@Res() res: Response) {
     const categories = await this.categoriesService.findAll();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: categories,
      message: "لیست دسته بندی ها با موفقیت دریافت شد"
    })
  }

  @Delete('remove-only-category/:id')
  async removeOnly(@Param('id') id: string, @Res() res: Response) {
    await this.categoriesService.removeOnlyCategory(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "دسته بندی مد نظر شما با موفقیت حذف شد"
    })
  }

  @Delete('safe-remove/:id')
  async safeRemove(@Param('id') id: string, @Res() res: Response) {
    await this.categoriesService.safeRemove(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "دسته بندی مد نظر شما با موفقیت حذف شد"
    })
  }

  @Delete('remove/:id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.categoriesService.remove(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "دسته بندی مد نظر شما با موفقیت حذف شد"
    })
  }
}

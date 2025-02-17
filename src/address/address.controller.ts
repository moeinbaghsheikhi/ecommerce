import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Put } from "@nestjs/common";
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Response } from "express";

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(@Body() createAddressDto: CreateAddressDto, @Res() res: Response) {
    const address = await this.addressService.create(createAddressDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: address,
      message: "آدرس با موفقیت ساخته شد"
    })
  }

  @Get()
  async findAll(@Res() res: Response) {
    const addresses = await this.addressService.findAll();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: addresses,
      message: "لیست آدرس ها با موفقیت دریافت شد"
    })
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const address = await this.addressService.findOne(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: address,
      message: "آدرس با موفقیت دریافت شد"
    })
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto, @Res() res: Response) {
    const address = await this.addressService.update(+id, updateAddressDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: address,
      message: "آدرس با موفقیت آپدیت شد"
    })
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.addressService.remove(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "آدرس مد نظر شما با موفقیت حذف شد"
    })
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Put, UseInterceptors } from "@nestjs/common";
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Response } from "express";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "src/auth/decorators/roles.decorator";
import Role from "src/users/enums/Role";
import { Permissions } from "src/auth/decorators/permissions.decorator";
import { LoggingInterceptor } from "src/interceptors/logging.interceptor";

@Roles(Role.NormalUser)
@ApiBearerAuth()
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
  async findAll() {
    const addresses = await this.addressService.findAll();

    return addresses
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const address = await this.addressService.findOne(+id);

    return address
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

  @Permissions('address:delete:own')
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.addressService.remove(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "آدرس مد نظر شما با موفقیت حذف شد"
    })
  }
}

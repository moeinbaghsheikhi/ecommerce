import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import Role from './enums/Role';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Roles(Role.Admin, Role.Moderator)
@ApiBearerAuth()
@ApiTags('Users - مدیریت کاربران')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  // @Permissions('create.user')
  @Post()
  @ApiOperation({ summary: "ایجاد کاربر جدید" })
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const createUser = await this.usersService.create(createUserDto);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: createUser,
      message: "کاربر جدید با موفقیت ساخته شد"
    })
  }

  @ApiQuery({
    name: "role",
    required: false
  })
  @ApiQuery({
    name: "limit",
    required: false
  })
  @ApiQuery({
    name: "page",
    required: false
  })
  @Get()
  @Permissions('read.user')
  async findAll(
    @Res() res: Response,
    @Query('role') role?: Role,
    @Query('limit')  limit  : number = 10,
    @Query('page')   page   : number = 1
  ) {
    const users = await this.usersService.findAll(role, limit, page)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: users,
      message: "لیست کاربر ها با موفقیت دریافت شد"
    })
  }

  @Permissions('read.user')
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findOne(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: user,
      message: "کاربر با موفقیت دریافت شد"
    })
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    const user = await this.usersService.update(+id, updateUserDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: user,
      message: "کاربر شما با موفقیت آپدیت شد"
    })
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.usersService.remove(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: null,
      message: "کاربر شما با موفقیت حذف شد"
    })
  }
}

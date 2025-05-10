import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Response } from 'express';
import { paymentOrderDto } from './dto/payment-order.dto';
import { verifyPayment } from './dto/verify-payment.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Res() res: Response) {
    const order = await this.ordersService.create(createOrderDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: order,
      message: " دیتا با موفقیت ساخته شد"
    })
  }

  @Get()
  async findAll(@Res() res: Response) {
    const orders = await this.ordersService.findAll();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: orders,
      message: " دیتا با موفقیت دریافت شد"
    })
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const order = await this.ordersService.findOne(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: order,
      message: " دیتا با موفقیت دریافت شد"
    })
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  @Post('/start-payment')
  async startPayment(@Body() paymentOrderDto: paymentOrderDto, @Res() res: Response) {
    const responsePay = await this.ordersService.startPayment(paymentOrderDto.order_id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { ...responsePay, payment_url: `https://gateway.zibal.ir/start/${responsePay.trackId}` },
      message: "لینک پرداخت با موفقیت ساخته شد"
    })
  }
  
  @Post('/verify-payment')
  async verifyPayment(@Body() verifyPayment: verifyPayment, @Res() res: Response) {
    const responsePay = await this.ordersService.verifyPayment(verifyPayment.trackId, verifyPayment.order_id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: responsePay,
      message: "تراکنش با موفقیت پردازش شد"
    })
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from '../users/entities/user.entity';
import { Address } from '../address/entities/address.entity';
import { Product } from '../products/entities/product.entity';
import { UsersService } from 'src/users/users.service';
import { AddressService } from 'src/address/address.service';
import { ProductsService } from 'src/products/products.service';
import { OrderStatus } from './enums/order-status.enum';
import { register } from 'module';
import { find, lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly userService: UsersService,
    private readonly addressService: AddressService,
    private readonly productService: ProductsService,
    private readonly httpService: HttpService
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // get user for order
    const user = await this.userService.findOne(createOrderDto.userId);

    // get address for order
    const address = await this.addressService.findOne(createOrderDto.addressId);

    // create temp order
    const order = this.orderRepository.create({
      user,
      address,
      discount_code: createOrderDto.discount_code,
      status: createOrderDto.status || OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    // assign items to order
    let totalPrice = 0
    if (createOrderDto.items && createOrderDto.items.length > 0) {
      const orderItems = createOrderDto.items.map(async (item) => {
        const product = await this.productService.findOne(item.productId);
        totalPrice += product.price

        const orderItem = this.orderItemRepository.create({
          order: savedOrder,
          product
        });

        return this.orderItemRepository.save(orderItem);
      });

      await Promise.all(orderItems);
    }

    // update total price in order
    await this.orderRepository.update({id: savedOrder.id}, {total_price: totalPrice})

    const returned_order = await this.orderRepository.findOne({ where: {id: savedOrder.id}, relations: ['user', 'address', 'items', 'items.product'] })

    return returned_order;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['user', 'address', 'items', 'items.product'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'address', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('سفارش یافت نشد');
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('سفارش یافت نشد');
    }

    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }

    // if (updateOrderDto.total_price) {
    //   order.total_price = updateOrderDto.total_price;
    // }

    if (updateOrderDto.discount_code) {
      order.discount_code = updateOrderDto.discount_code;
    }

    if (updateOrderDto.addressId) {
      const address = await this.addressService.findOne(updateOrderDto.addressId);
      order.address = address;
    }

    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('سفارش یافت نشد');
    }

    await this.orderRepository.remove(order);
  }

  async startPayment(order_id: number) {
    const order = await this.findOne(order_id);
    const request = this.httpService.post("https://gateway.zibal.ir/v1/request", { merchant: 'zibal', amount: (order.total_price * 10), callbackUrl: "https://sabzlearn.ir", orderId: 2 });

    const responseBody = await lastValueFrom(request);

    return responseBody.data;
  }

  async verifyPayment(trackId: number, order_id: number) {
    const request = this.httpService.post("https://gateway.zibal.ir/v1/verify", { merchant: 'zibal', trackId: trackId });

    const responseBody = await lastValueFrom(request);

    if(responseBody.data.result == 100) {
      const order = await this.findOne(order_id);
      order.status = OrderStatus.COMPLETED;
      await this.orderRepository.save(order);
    }

    return responseBody.data;
  }
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity'; // فرض بر این است که Entity Order قبلاً ایجاد شده است
import { Product } from '../../products/entities/product.entity'; // فرض بر این است که یک Entity برای محصولات وجود دارد

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, order => order.items)
    order: Order;

    @ManyToOne(() => Product)
    product: Product;
}
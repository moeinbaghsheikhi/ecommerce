import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class BookmarkProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.bookmarks)
    product: Product;   

    @ManyToOne(() => User, user => user.bookmarks)
    user: User;
}
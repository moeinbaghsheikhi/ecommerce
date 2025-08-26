import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Address } from "../../address/entities/address.entity";
import { Ticket } from "../../tickets/entities/ticket.entity";
import { BookmarkProduct } from "src/products/entities/product-bookmark.entity";
import { Product } from "src/products/entities/product.entity";
import { Order } from "src/orders/entities/order.entity";
import { Role } from "src/auth/entities/role.entity";
import { Permission } from "src/auth/entities/permission.entity";
import RoleEnum from "../enums/Role";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    mobile: string;

    @Column({ nullable: false })
    display_name: string;

    @Column({ nullable: true })
    password: string;

    @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.NormalUser })
    role: RoleEnum;

    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];

    @OneToMany(() => Ticket , (ticket) => ticket.user)
    tickets: Ticket[];

    @OneToMany(() => BookmarkProduct, bookmark => bookmark.user)
    bookmarks: BookmarkProduct[];

    @OneToMany(() => Order, order => order.user)
    orders: Order[];

    @ManyToMany(() => Product, (product) => product.baskets)
    @JoinTable({
        name: "basket_items",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "product_id", referencedColumnName: "id" },
    })
    basket_items: Product[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date; 


    @ManyToMany(() => Role)
    @JoinTable({ name: 'user_roles' })
    roles: Role[];

    @ManyToMany(() => Permission)
    @JoinTable({ name: 'user_permissions' })
    permissions: Permission[];
}
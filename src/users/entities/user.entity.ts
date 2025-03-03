import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import UserRoleEnum from "../enums/userRoleEnum";
import { Address } from "../../address/entities/address.entity";
import { Ticket } from "../../tickets/entities/ticket.entity";
import { BookmarkProduct } from "src/products/entities/product-bookmark.entity";

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

    @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.NormalUser })
    role: UserRoleEnum;

    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];

    @OneToMany(() => Ticket , (ticket) => ticket.user)
    tickets: Ticket[];

    @OneToMany(() => BookmarkProduct, bookmark => bookmark.user)
    bookmarks: BookmarkProduct[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
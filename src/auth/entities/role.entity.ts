import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission.entity";


@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string; // admin, support, warehouse, accounting

    @ManyToMany(() => Permission)
    @JoinTable({ name: 'role_permissions' })
    permissions: Permission[];
}
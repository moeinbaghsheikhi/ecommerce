import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string; // warehouse.create, warehouse.update
}
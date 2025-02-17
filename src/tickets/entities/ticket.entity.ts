import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToMany
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  subject: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.tickets)
  user: User;

  @ManyToOne(() => Ticket, (ticket) => ticket.replies, { nullable: true })
  replyTo: Ticket;

  @OneToMany(() => Ticket, (ticket) => ticket.replyTo)
  replies: Ticket[];
}
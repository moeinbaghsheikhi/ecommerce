import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Ticket } from "./entities/ticket.entity";
import { UsersService } from "../users/users.service";
import { Address } from "../address/entities/address.entity";

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly userService: UsersService,
  ) {}

  async create(createTicketDto: CreateTicketDto) :Promise<Ticket> {
    const { userId, replyTo, ...TicketDto } = createTicketDto;
    const user = await this.userService.findOne(userId);

    let replyToTicket = null
    if(replyTo) {
      replyToTicket = await this.ticketRepository.findOne({where: { id: replyTo }, relations: ['replyTo']});
      if(replyToTicket.replyTo) throw new BadRequestException("شما نمیتوانید این تیکت ها ریپلای کنید");
    }

    const ticket = this.ticketRepository.create({ ...TicketDto, user, replyTo: replyToTicket });
    return this.ticketRepository.save(ticket);
  }

  async findAll() {
    const tickets = await this.ticketRepository.createQueryBuilder("tickets").where("tickets.replyToId IS NULL").getMany();

    return tickets
  }

  async findOne(id: number){
    const ticket = await this.ticketRepository.findOneOrFail({ where: { id }, relations: ['replies', 'replyTo'] });

    return ticket;
  }
}

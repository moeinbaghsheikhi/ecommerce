import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IpRecord } from './entities/ip-record.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IpTrackerService {
    private readonly MAX_REQUESTS   = 4;
    private readonly WINDOW_MINUTES =  1;
    private readonly BLOCK_MINUTES  =  1;
    private readonly TEHRAN_TIMEZONE=  3.5 * 60 * 60 * 1000;

    constructor(
        @InjectRepository(IpRecord)
        private readonly ipRepository: Repository<IpRecord>
    ){}

    async track(ip: string){
        // now times
        const nowTime = new Date();
        const nowTimeTh = new Date(nowTime.getTime() + this.TEHRAN_TIMEZONE);

        let record = await this.ipRepository.findOne({ where: { ip } });

        // craete first record
        if(!record){
            let newRecord = this.ipRepository.create({
                ip,
                requestCount: 1,
                windowStart: nowTimeTh,
                isBlocked: false,
                blockUntil: null
            });
            await this.ipRepository.save(newRecord);

            console.log(`[${ip}] اولین درخواست را ارسال کرد`);
            return;
        }
        // ckeck blocked ip
        if(record.isBlocked && record.blockUntil && nowTimeTh < record.blockUntil){
            throw new HttpException(
                {
                  statusCode: HttpStatus.TOO_MANY_REQUESTS,
                  error: 'Too Many Requests',
                  message: `شما برای ${this.BLOCK_MINUTES} دقیقه محدود شده اید`,
                },
                HttpStatus.TOO_MANY_REQUESTS,
              );
        }

        // calculate windowEnd
        const windowEnd = new Date(record.windowStart.getTime() + (this.WINDOW_MINUTES * 60 * 1000));
            
        // refresh record
        if(nowTimeTh > windowEnd){
            record.requestCount = 1;
            record.windowStart  = nowTimeTh;
            record.isBlocked    = false;
            record.blockUntil   = null
        } else{
            if(record.requestCount >= this.MAX_REQUESTS){
                record.isBlocked = true;
                record.blockUntil = new Date(nowTime.getTime() + (this.BLOCK_MINUTES * 60 * 1000) + this.TEHRAN_TIMEZONE);
            }else {
                record.requestCount +=1;
            }
        }
        await this.ipRepository.save(record);
        if(record.isBlocked) {
            throw new HttpException(
                {
                  statusCode: HttpStatus.TOO_MANY_REQUESTS,
                  error: 'Too Many Requests',
                  message: `شما برای ${this.BLOCK_MINUTES} دقیقه محدود شده اید`,
                },
                HttpStatus.TOO_MANY_REQUESTS,
              );
        }
    }
}
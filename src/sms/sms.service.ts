import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class SmsService {
    constructor(@InjectQueue('sms-queue') private smsQueue: Queue){}

    async sendSms(mobiles: string[], message: string){
        mobiles.forEach((mobile, index) => {
            this.smsQueue.add(
                'send-sms',
                {mobile, message},
                {
                    // attempts: 3,
                    // backoff: 5000,
                    delay: (index +1) * 10000,
                    removeOnComplete: true,
                    removeOnFail: false
                }
            )
        })
    }
}

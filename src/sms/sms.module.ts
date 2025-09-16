import { Module } from '@nestjs/common';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';
import { BullModule } from '@nestjs/bull';
import { SmsProcessor } from './processors/send-sms.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sms-queue'
    })
  ],
  controllers: [SmsController],
  providers: [SmsService, SmsProcessor]
})
export class SmsModule {}

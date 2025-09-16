import { Body, Controller, Post } from '@nestjs/common';
import { SmsService } from './sms.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { SendSmsDto } from './dto/send-sms.dto';

@Controller('sms')
export class SmsController {
    constructor(private readonly smsService: SmsService){}

    @Public()
    @Post('send')
    async send(@Body() sendSmsDto: SendSmsDto){
        await this.smsService.sendSms(sendSmsDto.mobile, sendSmsDto.message)
        return "SMS Job queued!"
    }
}

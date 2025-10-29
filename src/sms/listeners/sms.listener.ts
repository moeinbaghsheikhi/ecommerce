import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";


@Injectable()
export class SmsListener {
    @OnEvent('sms.send')
    handleFactorCreate(payload: { message: string, mobile: string }){
        console.log(`send sms: ${payload.message} to: ${payload.mobile}`);
    }
}
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";


@Processor('sms-queue')
export class SmsProcessor {
    @Process('send-sms')
    async handleSend(job: Job<{mobile: string, message: string}>){
        console.log(`💬 Sending sms to ${job.data.mobile} with message: "${job.data.message}"`)
        
        // let number = Math.random()
        // console.log(number)
        // if(number < 0.5){
        //     console.log('❌ sms sending failed. will retry...')
        //     throw new Error('SMS service Error')
        // }

        console.log('✅ SMS send successfully!')
        return true;
    }
}
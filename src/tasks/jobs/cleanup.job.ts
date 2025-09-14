import { Injectable } from "@nestjs/common";

@Injectable()
export class CleanupJob {
    cleanOtp(){
        console.log("celaning...")
    }
}
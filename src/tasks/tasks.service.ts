import { Injectable } from '@nestjs/common';
import { CleanupJob } from './jobs/cleanup.job';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
    constructor(
        private readonly cleanUp: CleanupJob
    ){}

    @Cron(CronExpression.EVERY_5_MINUTES)
    cleanOtpData(){
        this.cleanUp.cleanOtp()
    }
}

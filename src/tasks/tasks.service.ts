import { Injectable } from '@nestjs/common';
import { CleanupJob } from './jobs/cleanup.job';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
    constructor(
        private readonly cleanUp: CleanupJob
    ){}

    @Cron(CronExpression.EVERY_12_HOURS)
    cleanOtpData(){
        this.cleanUp.cleanOtp()
    }
}

import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CleanupJob } from './jobs/cleanup.job';

@Module({
  providers: [TasksService, CleanupJob]
})
export class TasksModule {}

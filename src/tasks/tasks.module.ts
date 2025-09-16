import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CleanupJob } from './jobs/cleanup.job';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpRecord } from 'src/ip-tracker/entities/ip-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IpRecord])],
  providers: [TasksService, CleanupJob]
})
export class TasksModule {}

import { Module } from '@nestjs/common';
import { IpTrackerService } from './ip-tracker.service';
import { IpRecord } from './entities/ip-record.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([IpRecord])],
  providers: [IpTrackerService],
  exports: [IpTrackerService]
})
export class IpTrackerModule {}

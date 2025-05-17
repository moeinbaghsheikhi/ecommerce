import { Module } from '@nestjs/common';
import { IpTrackerService } from './ip-tracker.service';

@Module({
  providers: [IpTrackerService],
  exports: [IpTrackerService]
})
export class IpTrackerModule {}

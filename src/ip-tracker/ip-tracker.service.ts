import { Injectable } from '@nestjs/common';

@Injectable()
export class IpTrackerService {
    async test(ip: any) {
        console.log("connect to ipTracker service...")
    }
}
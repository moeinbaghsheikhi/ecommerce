import { Controller, Get } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('seeder')
export class SeederController {
    constructor(private seederService: SeederService) {}

    @Public()
    @Get('seed_permission_and_role')
    async seedPermissionAndRole(){
        await this.seederService.seedPermissionAndRole();
        return "seeder successfuly!";
    }
}

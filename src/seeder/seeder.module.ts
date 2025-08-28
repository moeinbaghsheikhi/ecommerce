import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/auth/entities/role.entity';
import { Permission } from 'src/auth/entities/permission.entity';
import { SeederController } from './seeder.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  providers: [SeederService],
  controllers: [SeederController]
})
export class SeederModule {}
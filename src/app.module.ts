import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';
import { TicketsModule } from './tickets/tickets.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { LoggerMiddleware } from './middlewares/logger/logger.middleware';
import { BodyLoggerMiddleware } from './middlewares/body-logger/body-logger.middleware';
import { IpTrackerModule } from './ip-tracker/ip-tracker.module';
import { IpTrackerMiddleware } from './ip-tracker/ip-tracker.middleware';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { SeederModule } from './seeder/seeder.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { BullModule } from '@nestjs/bull';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true
    }), 

    // Task scheduling
    ScheduleModule.forRoot(),

    // DB Connection
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
      synchronize: true
    }), 
    IpTrackerModule,

    // Bull
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379
      }
    }),

    // Modules
    UsersModule, AuthModule, AddressModule, TicketsModule, ProductsModule, CategoriesModule, OrdersModule, IpTrackerModule, SeederModule, TasksModule, SmsModule
  ],
  controllers: [AppController],
  providers: [AppService,
      {
        provide: APP_GUARD,
        useClass: JwtAuthGuard
      }
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer){
  //   consumer
  //   .apply(IpTrackerMiddleware)
  //   .forRoutes('*')
  // }
}

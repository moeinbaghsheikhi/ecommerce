import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger/logger.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ReponseFormatInterceptor } from './interceptors/response-format.interceptor';
import { GlobalExceptionFilter } from './exceptions/global.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(new LoggerMiddleware().use);
  app.useGlobalInterceptors(new ReponseFormatInterceptor);
  app.useGlobalFilters(new GlobalExceptionFilter)

  // swagger config
  const config = new DocumentBuilder()
    .setTitle('داکیومنت و مستندات api فروشگاهی')
    .setDescription('این مستندات برای تفهیم نحوه کار کردن با این api هست')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();

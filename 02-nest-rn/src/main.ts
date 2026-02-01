import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.setGlobalPrefix('api/v1', { exclude: [''] });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //xoa cai truong khong can thiet
    forbidNonWhitelisted: true //bao loi neu co truong khong can thiet
  }));

  //config cors
  app.enableCors(
    {
      "origin": true,//cho phep tat ca cac domain frontend
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //cho phep cac phuong thuc
      "preflightContinue": false,//khong can tiep tuc preflight
      credentials: true //cho phep gui cookie
    }
  );

  await app.listen(port);
}
bootstrap();

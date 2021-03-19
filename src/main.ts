import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';
import { AppModule } from './app.module';
import fmp from 'fastify-multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.register(fastifyCookie);
  app.register(fmp, {
    attachFieldsToBody: true,
    limits: {
      fieldSize: 15728640,
      fileSize: 15728640,
    },
  });
  app.enableCors({
    origin: ['https://www.yeongn.com'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  await app.listen(4000, '0.0.0.0');
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';
import fastifySession from '@mgcrea/fastify-session';
import { AppModule } from './app.module';
import RedisStore from '@mgcrea/fastify-session-redis-store';
import Redis from 'ioredis';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.register(fastifyCookie);
  app.register(fastifySession, {
    secret: process.env.APP_SECRET,
    store: new RedisStore({ client: new Redis(6379, process.env.REDIS_HOST) }),
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 864e3,
    },
  });
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:80',
      'https://www.yeongn.com',
      'http://www.yeongn.com',
      'http://frontend',
    ],
  });
  await app.listen(4000, '0.0.0.0');
}
bootstrap();

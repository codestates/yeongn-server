import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { JwtService } from './jwt/jwt.service';
import * as ormconfig from './ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), UserModule],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}

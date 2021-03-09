import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AppraisalModule } from './appraisal/appraisal.module';
import { ShopModule } from './shop/shop.module';
import * as ormconfig from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    UserModule,
    ShopModule,
    AppraisalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

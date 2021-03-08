import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { JwtService } from './jwt/jwt.service';
import { AppraisalController } from './appraisal/appraisal.controller';
import { AppraisalModule } from './appraisal/appraisal.module';
import { AppraisalService } from './appraisal/appraisal.service';
import { ShopController } from './shop/shop.controller';
import { ShopService } from './shop/shop.service';
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
  providers: [AppService, JwtService, ShopService, AppraisalService],
})
export class AppModule {}

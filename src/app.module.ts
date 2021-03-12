import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AppraisalModule } from './appraisal/appraisal.module';
import { ShopModule } from './shop/shop.module';
import { RecommendService } from './recommend/recommend.service';
import { SearchModule } from './search/search.module';
import * as ormconfig from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    UserModule,
    ShopModule,
    AppraisalModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService, RecommendService],
})
export class AppModule {}

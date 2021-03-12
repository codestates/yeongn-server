import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { JwtService } from 'src/jwt/jwt.service';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from 'src/entity/Sale.entity';
import { SalesComment } from 'src/entity/SalesComment.entity';
import { User } from 'src/entity/User.entity';
import { RecommendService } from 'src/recommend/recommend.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SalesComment, User])],
  providers: [ShopService, JwtService, ImageUploadService, RecommendService],
  controllers: [ShopController],
})
export class ShopModule {}

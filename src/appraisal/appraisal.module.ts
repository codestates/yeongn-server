import { Module } from '@nestjs/common';
import { AppraisalController } from './appraisal.controller';
import { AppraisalService } from './appraisal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appraisal } from 'src/entity/Appraisal.entity';
import { AppraisalsComment } from 'src/entity/AppraisalsComment.entity';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/entity/User.entity';
import { RecommendService } from 'src/recommend/recommend.service';
import { UsersAppraisalsPrice } from 'src/entity/UsersAppraisalsPrice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appraisal,
      AppraisalsComment,
      User,
      UsersAppraisalsPrice,
    ]),
  ],
  providers: [
    AppraisalService,
    ImageUploadService,
    JwtService,
    RecommendService,
  ],
  controllers: [AppraisalController],
})
export class AppraisalModule {}

import { Module } from '@nestjs/common';
import { AppraisalController } from './appraisal.controller';
import { AppraisalService } from './appraisal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appraisal } from 'src/entity/Appraisal.entity';
import { AppraisalsComment } from 'src/entity/AppraisalsComment.entity';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/entity/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appraisal, AppraisalsComment, User])],
  providers: [AppraisalService, ImageUploadService, JwtService],
  controllers: [AppraisalController],
})
export class AppraisalModule {}

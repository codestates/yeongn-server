import { Module } from '@nestjs/common';
import { AppraisalController } from './appraisal.controller';
import { AppraisalService } from './appraisal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appraisal } from 'src/entity/Appraisal.entity';
import { AppraisalsComment } from 'src/entity/AppraisalsComment.entity';
import { ImageUploadService } from 'src/image-upload/image-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appraisal, AppraisalsComment])],
  providers: [AppraisalService, ImageUploadService],
  controllers: [AppraisalController],
})
export class AppraisalModule {}

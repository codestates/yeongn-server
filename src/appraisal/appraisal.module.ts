import { Module } from '@nestjs/common';
import { AppraisalController } from './appraisal.controller';
import { AppraisalService } from './appraisal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appraisal } from 'src/entity/Appraisal.entity';
import { AppraisalsComment } from 'src/entity/AppraisalsComment.entity';
import { AppraisalsImage } from 'src/entity/AppraisalsImage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appraisal, AppraisalsComment, AppraisalsImage]),
  ],
  controllers: [AppraisalController],
  providers: [AppraisalService],
})
export class AppraisalModule {}

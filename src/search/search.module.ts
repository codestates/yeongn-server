import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appraisal } from 'src/entity/Appraisal.entity';
import { Sale } from 'src/entity/Sale.entity';
import { RecommendService } from 'src/recommend/recommend.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appraisal, Sale])],
  providers: [SearchService, RecommendService],
  controllers: [SearchController],
})
export class SearchModule {}

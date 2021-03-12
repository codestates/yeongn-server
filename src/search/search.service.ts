import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appraisal } from 'src/entity/Appraisal.entity';
import { Repository, Like } from 'typeorm';
import { Sale } from 'src/entity/Sale.entity';
import { RecommendService } from 'src/recommend/recommend.service';
import { SearchResultDto } from './dto/searchResult.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Appraisal)
    private appraisalRepository: Repository<Appraisal>,
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    private recommendService: RecommendService,
  ) {}

  async search(query: string): Promise<SearchResultDto> {
    const appraisals = await this.appraisalRepository.find({
      where: [
        { itemName: Like(`%${query}%`) },
        { description: Like(`%${query}%`) },
      ],
      relations: ['user', 'usersAppraisalsPrices'],
    });
    const appraisalResult = await Promise.all(
      appraisals.map(async (appraisal) => {
        appraisal['nickname'] = appraisal.user.nickname;
        delete appraisal.user;
        const key = `appraisal:${appraisal.id}`;
        if (appraisal.usersAppraisalsPrices.length) {
          const sum = appraisal.usersAppraisalsPrices.reduce(
            (acc, appraisal) => {
              return acc + appraisal.price;
            },
            0,
          );
          appraisal['average'] = Math.floor(
            sum / appraisal.usersAppraisalsPrices.length,
          );
        } else {
          appraisal['average'] = 0;
        }
        appraisal['likeCount'] = await this.recommendService.getCount(key);
        return appraisal;
      }),
    );

    const sales = await this.saleRepository.find({
      where: [
        { itemName: Like(`%${query}%`) },
        { description: Like(`%${query}%`) },
      ],
      relations: ['user'],
    });

    const saleResult = await Promise.all(
      sales.map(async (sale) => {
        sale['nickname'] = sale.user.nickname;
        delete sale.user;
        const key = `sale:${sale.id}`;
        sale['likeCount'] = await this.recommendService.getCount(key);
        return sale;
      }),
    );

    return {
      appraisals: appraisalResult,
      sales: saleResult,
    };
  }
}

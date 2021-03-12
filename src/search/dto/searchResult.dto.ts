import { Appraisal } from 'src/entity/Appraisal.entity';
import { Sale } from 'src/entity/Sale.entity';

export class SearchResultDto {
  appraisals: Array<Appraisal>;
  sales: Array<Sale>;
}

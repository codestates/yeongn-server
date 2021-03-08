import { Test, TestingModule } from '@nestjs/testing';
import { AppraisalService } from './appraisal.service';

describe('AppraisalService', () => {
  let service: AppraisalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppraisalService],
    }).compile();

    service = module.get<AppraisalService>(AppraisalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

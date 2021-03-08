import { Test, TestingModule } from '@nestjs/testing';
import { AppraisalController } from './appraisal.controller';

describe('AppraisalController', () => {
  let controller: AppraisalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppraisalController],
    }).compile();

    controller = module.get<AppraisalController>(AppraisalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

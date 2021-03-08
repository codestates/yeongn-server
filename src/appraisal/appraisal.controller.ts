import { Controller, Get } from '@nestjs/common';

@Controller('appraisal')
export class AppraisalController {
  @Get()
  home() {
    return 'Welcome to my Appraisal API';
  }
}

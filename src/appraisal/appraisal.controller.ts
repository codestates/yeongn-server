import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppraisalService } from './appraisal.service';
import { FastifyRequest, FastifyReply } from 'fastify';

@Controller('api/appraisal')
export class AppraisalController {
  constructor(private readonly appraisalService: AppraisalService) {}

  @Post()
  createPost(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    return this.appraisalService.postAppraisal(req, res);
  }
}

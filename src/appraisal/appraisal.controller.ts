import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { AppraisalService } from './appraisal.service';
import { FastifyRequest, FastifyReply } from 'fastify';

@Controller('api/appraisal')
export class AppraisalController {
  constructor(private readonly appraisalService: AppraisalService) {}

  @Post()
  createPost(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    return this.appraisalService.postAppraisal(req, res);
  }

  @Delete('/:appraisalId')
  deletePost(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Param('appraisalId') appraisalId: string,
  ) {
    return this.appraisalService.deleteAppraisal(req, res, appraisalId);
  }

  @Patch('/:appraisalId/comment')
  modifyPost(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Param('appraisalId') appraisalId: string,
  ) {
    return this.appraisalService.modifyAppraisal(req, res, appraisalId);
  }
}

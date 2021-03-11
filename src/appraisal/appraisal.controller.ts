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

  @Patch('/:appraisalId')
  modifyPost(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Param('appraisalId') appraisalId: string,
  ) {
    return this.appraisalService.modifyAppraisal(req, res, appraisalId);
  }

  @Post('/:appraisalId/comment')
  createComment(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Param('appraisalId') appraisalId: string,
  ) {
    return this.appraisalService.createComment(req, res, appraisalId);
  }

  @Patch('/comment/:commentId')
  modifyComment(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Param('commentId') commentId: string,
  ) {
    return this.appraisalService.modifyComment(req, res, commentId);
  }

  @Delete('/comment/:commentId')
  deleteComment(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Param('commentId') commentId: string,
  ) {
    return this.appraisalService.deleteComment(req, res, commentId);
  }

  @Patch('/:appraisalId/recommend')
  recommendAppraisal(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Param('appraisalId') appraisalId: string,
  ) {
    return this.appraisalService.recommendAppraisal(req, res, appraisalId);
  }
}

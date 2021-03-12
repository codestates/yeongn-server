import {
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { FastifyRequest, FastifyReply } from 'fastify';

@Controller('api/shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  createSale(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    this.shopService.postSale(req, res);
  }

  @Delete('/:saleId')
  deleteSale(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Param('saleId') saleId: string,
  ) {
    return this.shopService.deleteSale(req, res, saleId);
  }

  @Patch('/:saleId')
  modifySale(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Param('saleId') saleId: string,
  ) {
    return this.shopService.modifySale(req, res, saleId);
  }
  @Post('/:postId/comment')
  createComment(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Param('postId') postId: string,
  ) {
    return this.shopService.createComment(req, res, postId);
  }
  @Patch('/comment/:commentId')
  modifyComment(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Param('commentId') commentId: string,
  ) {
    return this.shopService.modifyComment(req, res, commentId);
  }

  @Delete('/comment/:commentId')
  deleteComment(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Param('commentId') commentId: string,
  ) {
    return this.shopService.deleteComment(req, res, commentId);
  }

  @Get()
  getAll() {
    return this.shopService.getSales();
  }

  @Get('/:saleId')
  getOne(@Req() req: FastifyRequest, @Param('saleId') saleId: string) {
    return this.shopService.getSale(req, saleId);
  }
}

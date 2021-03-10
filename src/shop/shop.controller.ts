import { Controller, Post, Req, Res } from '@nestjs/common';
import { ShopService } from './shop.service';
import { FastifyRequest, FastifyReply } from 'fastify';

@Controller('api/shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  createSale(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    this.shopService.postSale(req, res);
  }
}

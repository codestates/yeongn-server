import {
  Injectable,
  ForbiddenException,
  NotAcceptableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from 'src/entity/Sale.entity';
import { Repository } from 'typeorm';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { JwtService } from 'src/jwt/jwt.service';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    private imageUploadService: ImageUploadService,
    private jwt: JwtService,
  ) {}
  async postSale(req: FastifyRequest, res: FastifyReply) {
    const auth = req.headers['authorization'];
    if (!auth) throw new ForbiddenException();
    const formdata = await req.body;
    const image = formdata['image'];
    const buffer: Buffer = await image.toBuffer();

    const tokenData = await this.jwt.verifyToken(auth.split(' ')[1]);
    try {
      const itemName: string = formdata['title'].value;
      const category: string = formdata['category'].value;
      const description: string = formdata['text'].value;
      const userPrice: string = formdata['price'].value;
      const contact: string = formdata['contact'].value;
      const titleRegex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s]*$/;
      if (!itemName || !category || !description || !userPrice || !contact) {
        throw new NotAcceptableException('입력안한값이 있다!');
      }
      if (!titleRegex.test(itemName)) {
        throw new NotAcceptableException('제목의 상태가 영 좋지않네');
      }
      const imgUrl = await this.imageUploadService.uploadImage(
        image.filename,
        buffer,
      );
      const userId: number = tokenData['id'];

      const newSale = new Sale();

      newSale.itemName = itemName;
      newSale.category = category;
      newSale.description = description;
      newSale.userPrice = userPrice;
      newSale.contact = contact;
      newSale.imgUrl = imgUrl;
      newSale.userId = userId;

      await this.saleRepository.save(newSale);

      console.log(newSale);
      res.send({
        saleId: newSale.id,
        message: 'created!',
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}

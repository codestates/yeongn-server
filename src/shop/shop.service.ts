import {
  Injectable,
  ForbiddenException,
  NotAcceptableException,
  InternalServerErrorException,
  NotFoundException,
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
      if (!itemName || !category || !description || !userPrice || !contact) {
        throw new NotAcceptableException('입력안한값이 있다!');
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

  async deleteSale(req: FastifyRequest, res: FastifyReply, saleId: string) {
    const auth = req.headers['authorization'];
    if (!auth) throw new ForbiddenException();
    const tokenData = await this.jwt.verifyToken(auth.split(' ')[1]);
    const userId = tokenData['id'];
    const targetPost: Sale = await this.saleRepository.findOne(+saleId);
    if (!targetPost) {
      throw new NotFoundException('포스트를 찾을 수 없음');
    }
    if (targetPost.userId !== userId) {
      throw new NotAcceptableException('권한이 없으셈');
    }
    await this.saleRepository.remove(targetPost);
    res.send({
      message: 'deleted!',
    });
  }

  async modifySale(req: FastifyRequest, res: FastifyReply, saleId: string) {
    const auth = req.headers['authorization'];
    if (!auth) throw new ForbiddenException();
    const tokenData = await this.jwt.verifyToken(auth.split(' ')[1]);
    const userId = tokenData['id'];

    const formdata = await req.body;
    console.log(formdata);
    const image = formdata['image'];
    let imgUrl: string;

    const itemName: string = formdata['title'].value;
    const category: string = formdata['category'].value;
    const description: string = formdata['text'].value;
    const userPrice: string = formdata['price'].value;
    const contact: string = formdata['contact'].value;
    if (!itemName || !category || !description || !userPrice) {
      throw new NotAcceptableException('입력안한값이 있다!');
    }
    if (image) {
      const buffer: Buffer = await image.toBuffer();
      imgUrl = await this.imageUploadService.uploadImage(
        image.filename,
        buffer,
      );
    }

    const targetPost: Sale = await this.saleRepository.findOne(saleId);
    if (!targetPost) {
      throw new NotFoundException('포스트를 찾을 수 없음');
    }
    if (targetPost.userId !== userId) {
      throw new NotAcceptableException('권한이 없으셈');
    }
    if (imgUrl) {
      await this.saleRepository.update(saleId, {
        itemName,
        category,
        description,
        userPrice,
        imgUrl,
        contact,
      });
      res.send({
        message: 'modified :3',
      });
    } else {
      this.saleRepository.update(saleId, {
        itemName,
        category,
        description,
        userPrice,
        contact,
      });
      res.send({
        message: 'modified :3',
      });
    }
  }
}

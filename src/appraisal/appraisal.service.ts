import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
  NotAcceptableException,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { JwtService } from 'src/jwt/jwt.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appraisal } from 'src/entity/Appraisal.entity';
@Injectable()
export class AppraisalService {
  constructor(
    @InjectRepository(Appraisal)
    private appraisalRepository: Repository<Appraisal>,
    private imageUploadService: ImageUploadService,
    private jwt: JwtService,
  ) {}
  async postAppraisal(req: FastifyRequest, res: FastifyReply) {
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
      const titleRegex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s]*$/;
      if (!itemName || !category || !description || !userPrice) {
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

      const newAppraisal = new Appraisal();

      newAppraisal.itemName = itemName;
      newAppraisal.category = category;
      newAppraisal.description = description;
      newAppraisal.userPrice = userPrice;
      newAppraisal.imgUrl = imgUrl;
      newAppraisal.userId = userId;

      await this.appraisalRepository.save(newAppraisal);

      console.log(newAppraisal);
      res.code(201).send({
        appraisalId: newAppraisal.id,
        message: 'created!',
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}

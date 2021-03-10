import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
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
      const url = await this.imageUploadService.uploadImage(
        image.filename,
        buffer,
      );
      const userId: number = tokenData['id'];

      const newAppraisal = new Appraisal();

      newAppraisal.itemName = formdata['title'].value;
      newAppraisal.category = formdata['category'].value;
      newAppraisal.description = formdata['text'].value;
      newAppraisal.userPrice = formdata['price'].value;
      newAppraisal.imgUrl = url;
      newAppraisal.userId = userId;

      await this.appraisalRepository.save(newAppraisal);
      console.log(newAppraisal);
      res.code(201).send('created!');
    } catch {
      throw new InternalServerErrorException();
    }
  }
}

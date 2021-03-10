import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
@Injectable()
export class AppraisalService {
  constructor(private imageUploadService: ImageUploadService) {}
  async postAppraisal(req: FastifyRequest, res: FastifyReply) {
    const mp = await req.body[''];
    console.log(mp);
    const buffer: Buffer = await mp.toBuffer();
    console.log(buffer);
    try {
      const url = await this.imageUploadService.uploadImage(
        mp.filename,
        buffer,
      );
      res.send(url);
    } catch {
      throw new InternalServerErrorException();
    }
  }
}

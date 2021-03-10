import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ImageUploadService {
  private filename;
  private buffer;
  private s3;

  constructor() {
    this.s3 = new AWS.S3(this.getConfig());
  }
  private getConfig() {
    return {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'ap-northeast-2',
    };
  }

  private getParam() {
    return {
      Bucket: 'yeongn-images',
      Key:
        'image/' +
        `${Date.now().toString()}-${encodeURIComponent(this.filename)}`,
      ACL: 'public-read',
      Body: this.buffer,
    };
  }

  async uploadImage(fn: string, bf: Buffer): Promise<string> {
    this.filename = fn;
    this.buffer = bf;
    const param = this.getParam();
    return new Promise((resolve, rejected) => {
      this.s3.upload(param, (err, data) => {
        if (err) throw new InternalServerErrorException();
        resolve(data.Location);
      });
    });
  }
}

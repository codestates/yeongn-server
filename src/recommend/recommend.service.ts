import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';
import * as dotenv from 'dotenv';
dotenv.config();

//scard 길이
//sismember 존재여부
//srem 해당요소 삭제
@Injectable()
export class RecommendService {
  private client;

  constructor() {
    this.client = this.getClient();
  }

  private async getClient() {
    this.client = new Redis({
      port: 6379,
      host: process.env.REDIS_HOST,
    });
  }

  async recommend(postKey: string, userId: string): Promise<number> {
    const key = postKey; // sale이면 sale:1 appraisal이면 appraisal:1
    const value = `user:${userId}`;

    const isExist = await this.client.sismember(key, value);
    if (isExist) {
      await this.client.srem(key, value);
    } else {
      await this.client.sadd();
    }

    const count = await this.getCount(key);

    return count;
  }

  async getCount(postKey: string): Promise<number> {
    const key = postKey; // sale이면 sale:1 appraisal이면 appraisal:1

    const count = await this.client.scard(key);

    return count;
  }

  async isRecommend(postKey: string, userId: string): Promise<boolean> {
    const key = postKey; // sale이면 sale:1 appraisal이면 appraisal:1
    const value = `user:${userId}`;

    const result = await this.client.sismember(key, value);

    if (result) {
      return true;
    } else {
      return false;
    }
  }
}

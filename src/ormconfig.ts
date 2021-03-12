import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './entity/User.entity';
import { Appraisal } from './entity/Appraisal.entity';
import { Sale } from './entity/Sale.entity';
import { AppraisalsComment } from './entity/AppraisalsComment.entity';
import { SalesComment } from './entity/SalesComment.entity';
import { UsersAppraisalsPrice } from './entity/UsersAppraisalsPrice.entity';
dotenv.config();

const config: ConnectionOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'yeongn',
  timezone: '+00:00',
  entities: [
    User,
    Appraisal,
    Sale,
    AppraisalsComment,
    SalesComment,
    UsersAppraisalsPrice,
  ],
  synchronize: true,
};
export = config;

import { Injectable, NotAcceptableException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  signToken(payload): string {
    const token = jwt.sign(payload, process.env.APP_SECRET);
    return token;
  }

  async verifyToken(token: string) {
    let result;
    jwt.verify(token, process.env.APP_SECRET, function (err, decoded) {
      if (err) throw new NotAcceptableException();
      result = decoded;
    });
    return result;
  }
}

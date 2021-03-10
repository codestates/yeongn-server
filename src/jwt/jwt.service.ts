import { Injectable, NotAcceptableException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { resolve } from 'path';

@Injectable()
export class JwtService {
  signToken(payload): string {
    const token = jwt.sign(payload, process.env.APP_SECRET);
    return token;
  }

  async verifyToken(token: string) {
    return new Promise((resolved, rejected) => {
      jwt.verify(token, process.env.APP_SECRET, function (err, decoded) {
        if (err) throw new NotAcceptableException();
        resolved(decoded);
      });
    });
  }
}

import {
  Injectable,
  ForbiddenException,
  HttpService,
  BadGatewayException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FastifyRequest } from 'fastify';
import { User } from '../entity/User.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private httpService: HttpService,
  ) {}
  async googleLogin({ authorizationCode }) {
    if (!authorizationCode) {
      throw new ForbiddenException();
    }
    try {
      console.log(authorizationCode);
      const GET_TOKEN_URI = 'https://www.googleapis.com/oauth2/v4/token';
      const GET_DATA_URI = 'https://www.googleapis.com/oauth2/v2/userinfo';
      const CLIENT_ID =
        '604944373689-q294luegtuje1qpkiq0q3jrfqd8ps6qp.apps.googleusercontent.com';
      const accessTokenFromGoogle = await this.httpService
        .post(
          GET_TOKEN_URI,
          {
            client_id: CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: authorizationCode,
            grant_type: 'authorization_code',
            redirect_uri: 'http://localhost:3000/login',
          },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        )
        .toPromise();
      console.log(accessTokenFromGoogle);
      const dataFromToken = await this.httpService
        .get(GET_DATA_URI, {
          headers: {
            Authorization: `Bearer ${accessTokenFromGoogle.data.access_token}`,
          },
        })
        .toPromise();
      console.log(dataFromToken);
    } catch {
      throw new BadGatewayException();
    }
  }
  naverLogin(req: FastifyRequest) {}
  kakaoLogin(req: FastifyRequest) {}
  appraisalCount() {}
  withdrawal() {}
  logout() {}
}

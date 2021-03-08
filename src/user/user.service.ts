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
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private httpService: HttpService,
    private jwt: JwtService,
  ) {}
  async googleLogin({ authorizationCode }, session) {
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
      const { email, name } = dataFromToken.data;
      const userData = await this.usersRepository.findOne({ email });
      if (userData) {
        const token = this.jwt.signToken({ ...userData });
        session.set('token', token);
        return {
          nickname: name,
          email,
        };
      } else {
        const newUser = new User();
        newUser.nickname = name;
        newUser.email = email;
        newUser.social = 'google';
        await this.usersRepository.save(newUser);
        const token = this.jwt.signToken({ ...newUser });
        session.set('token', token);
        return {
          nickname: name,
          email,
        };
      }
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

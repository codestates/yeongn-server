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
import { CookieSerializeOptions } from 'fastify-cookie';

@Injectable()
export class UserService {
  private readonly COOKIE_OPTION: CookieSerializeOptions = {
    secure: false,
    httpOnly: false,
    maxAge: 1000 * 60 * 10,
  };
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private httpService: HttpService,
    private jwt: JwtService,
  ) {}
  async googleLogin({ authorizationCode }, res) {
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
            redirect_uri: 'https://www.yeongn.com/login',
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
        res.setCookie('token', token, this.COOKIE_OPTION);
        res.setCookie('username', name, this.COOKIE_OPTION);
        res.setCookie('email', email, this.COOKIE_OPTION);
        res.send({
          nickname: name,
          email,
        });
      } else {
        const newUser = new User();
        newUser.nickname = name;
        newUser.email = email;
        newUser.social = 'google';
        await this.usersRepository.save(newUser);
        const token = this.jwt.signToken({ ...newUser });
        res.setCookie('token', token, this.COOKIE_OPTION);
        res.setCookie('username', name, this.COOKIE_OPTION);
        res.setCookie('email', email, this.COOKIE_OPTION);
        res.send({
          nickname: name,
          email,
        });
      }
    } catch {
      throw new BadGatewayException();
    }
  }
  async naverLogin({ authorizationCode }, res) {
    if (!authorizationCode) {
      throw new ForbiddenException();
    }
    try {
      const CLIENT_ID = '6uSvluf8fHGhNvp6U3j2';
      const GET_TOKEN_URI = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET_NAVER}&code=${authorizationCode}`;
      const GET_DATA_URI = 'https://openapi.naver.com/v1/nid/me';

      const accessTokenFromNaver = await this.httpService
        .get(GET_TOKEN_URI)
        .toPromise();
      console.log(accessTokenFromNaver, '토큰');
      const dataFromToken = await this.httpService
        .get(GET_DATA_URI, {
          headers: {
            Authorization: `Bearer ${accessTokenFromNaver.data.access_token}`,
          },
        })
        .toPromise();
      const { email, nickname } = dataFromToken.data.response;
      const userData = await this.usersRepository.findOne({ email });
      if (userData) {
        const token = this.jwt.signToken({ ...userData });
        res.setCookie('token', token, this.COOKIE_OPTION);
        res.setCookie('username', nickname, this.COOKIE_OPTION);
        res.setCookie('email', email, this.COOKIE_OPTION);
        res.send({
          nickname,
          email,
        });
      } else {
        const newUser = new User();
        newUser.nickname = nickname;
        newUser.email = email;
        newUser.social = 'naver';
        await this.usersRepository.save(newUser);
        const token = this.jwt.signToken({ ...newUser });
        res.setCookie('token', token, this.COOKIE_OPTION);
        res.setCookie('username', nickname, this.COOKIE_OPTION);
        res.setCookie('email', email, this.COOKIE_OPTION);
        res.send({
          nickname,
          email,
        });
      }
    } catch {
      throw new BadGatewayException();
    }
  }
  kakaoLogin(req: FastifyRequest) {}
  appraisalCount() {}
  withdrawal() {}
  logout() {}
}

import {
  Injectable,
  ForbiddenException,
  HttpService,
  BadGatewayException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { FastifyRequest } from 'fastify';
import { User } from '../entity/User.entity';
import { JwtService } from '../jwt/jwt.service';
import { CookieSerializeOptions } from 'fastify-cookie';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class UserService {
  private readonly COOKIE_OPTION: CookieSerializeOptions = {
    secure: false,
    httpOnly: false,
    maxAge: 1000 * 60 * 10,
    path: '/',
    domain: 'yeongn.com',
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
      const dataFromToken = await this.httpService
        .get(GET_DATA_URI, {
          headers: {
            Authorization: `Bearer ${accessTokenFromGoogle.data.access_token}`,
          },
        })
        .toPromise();
      const { id, name } = dataFromToken.data;
      const userData = await this.usersRepository.findOne({
        socialId: id,
        social: 'google',
      });
      console.log(userData);
      if (userData) {
        const token = this.jwt.signToken({ ...userData });
        res.setCookie('token', token, this.COOKIE_OPTION);
        res.setCookie('userId', userData.id, this.COOKIE_OPTION);
        res.send({
          userId: userData.id,
          token,
        });
      } else {
        const newUser = new User();
        newUser.nickname = name;
        newUser.socialId = id;
        newUser.social = 'google';
        await this.usersRepository.save(newUser);
        const token = this.jwt.signToken({ ...newUser });
        res.setCookie('token', token, this.COOKIE_OPTION);
        res.setCookie('userId', newUser.id, this.COOKIE_OPTION);
        res.send({
          userId: newUser.id,
          token,
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
      const dataFromToken = await this.httpService
        .get(GET_DATA_URI, {
          headers: {
            Authorization: `Bearer ${accessTokenFromNaver.data.access_token}`,
          },
        })
        .toPromise();
      console.log(dataFromToken);
      const { id, nickname } = dataFromToken.data.response;
      const userData = await this.usersRepository.findOne({
        socialId: id,
        social: 'naver',
      });
      console.log(userData);
      if (userData) {
        const token = this.jwt.signToken({ ...userData });
        res.setCookie('token', token, this.COOKIE_OPTION);
        res.setCookie('userId', userData.id, this.COOKIE_OPTION);
        res.send({
          userId: userData.id,
          token,
        });
      } else {
        const newUser = new User();
        newUser.nickname = nickname;
        newUser.socialId = id;
        newUser.social = 'naver';
        await this.usersRepository.save(newUser);
        const token = this.jwt.signToken({ ...newUser });
        res.setCookie('token', token, this.COOKIE_OPTION);
        res.setCookie('userId', newUser.id, this.COOKIE_OPTION);
        res.send({
          userId: newUser.id,
          token,
        });
      }
    } catch {
      throw new BadGatewayException();
    }
  }
  async kakaoLogin({ authorizationCode }, res) {
    if (!authorizationCode) {
      throw new ForbiddenException();
    }
    try {
      const CLIENT_ID = 'b862dc01a142ef533360f21219d2247b';
      const GET_TOKEN_URI = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${CLIENT_ID}&redirect_uri=https://www.yeongn.com/login&code=${authorizationCode}&client_secret=${process.env.CLIENT_SECRET_KAKAO}`;
      const GET_DATA_URI = 'https://kapi.kakao.com/v2/user/me';

      const accessTokenFromKakao = await this.httpService
        .get(GET_TOKEN_URI)
        .toPromise();
      console.log(accessTokenFromKakao);
      const dataFromToken = await this.httpService
        .get(GET_DATA_URI, {
          headers: {
            Authorization: `Bearer ${accessTokenFromKakao.data.access_token}`,
          },
        })
        .toPromise();
      const socialId = dataFromToken.data.id;
      const nickname = dataFromToken.data.properties.nickname;
      const userData = await this.usersRepository.findOne({
        socialId,
        social: 'kakao',
      });
      if (userData) {
        console.log(userData);
        const token = this.jwt.signToken({ ...userData });
        res.setCookie('token', token, this.COOKIE_OPTION);
        res.setCookie('userId', userData.id, this.COOKIE_OPTION);
        res.send({
          userId: userData.id,
          token,
        });
      } else {
        const newUser = new User();
        newUser.nickname = nickname;
        newUser.socialId = socialId;
        newUser.social = 'kakao';
        await this.usersRepository.save(newUser);
        const token = this.jwt.signToken({ ...newUser });
        res.setCookie('token', token, this.COOKIE_OPTION);
        res.setCookie('userId', newUser.id, this.COOKIE_OPTION);
        res.send({
          userId: newUser.id,
          token,
        });
      }
    } catch {
      throw new BadGatewayException();
    }
  }
  async getUserData(req: FastifyRequest) {
    const auth = req.headers['authorization'];
    if (!auth) throw new ForbiddenException();
    const tokenData = await this.jwt.verifyToken(auth.split(' ')[1]);
    const userId = tokenData['id'];

    const userData = await this.usersRepository.findOne(userId, {
      relations: ['appraisals', 'sales', 'usersAppraisalsPrices'],
    });
    userData['appraisalCount'] = userData.usersAppraisalsPrices.length;
    delete userData.usersAppraisalsPrices;

    return userData;
  }
  async changeNickname(req: FastifyRequest) {
    const auth = req.headers['authorization'];
    if (!auth) throw new ForbiddenException();
    const tokenData = await this.jwt.verifyToken(auth.split(' ')[1]);
    const userId = tokenData['id'];
    const nickname: string = req.body['nickname'];

    const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/;
    if (!regex.test(nickname)) {
      throw new NotAcceptableException('입력을 제대로..');
    }

    await this.usersRepository.update(userId, { nickname });

    return {
      message: 'modified :3',
      nickname: nickname,
    };
  }
  async withdrawal(req: FastifyRequest, res: FastifyReply) {
    const auth = req.headers['authorization'];
    if (!auth) throw new ForbiddenException();
    const tokenData = await this.jwt.verifyToken(auth.split(' ')[1]);
    const userId = tokenData['id'];

    try {
      await this.usersRepository.delete(userId);
    } catch {
      throw new NotFoundException();
    }

    res.clearCookie('token', this.COOKIE_OPTION);
    res.clearCookie('userId', this.COOKIE_OPTION);
    res.send({
      message: 'deleted!',
    });
  }
  async logout(res: FastifyReply) {
    res.clearCookie('token', this.COOKIE_OPTION);
    res.clearCookie('userId', this.COOKIE_OPTION);
    res.send({
      message: 'bye!',
    });
  }
}

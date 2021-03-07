import { Controller, Get, Req, Post, Delete, Body } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UserService } from './user.service';
import { AuthorizationCodeDto } from './dto/AuthorizationCode.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/google')
  googleLogin(@Body() authorizationCode: AuthorizationCodeDto) {
    return this.userService.googleLogin(authorizationCode);
  }

  @Post('/naver')
  naverLogin(@Req() request: FastifyRequest) {
    return this.userService.naverLogin(request);
  }

  @Post('/kakao')
  kakaoLogin(@Req() request: FastifyRequest) {
    return this.userService.kakaoLogin(request);
  }

  @Post('/logout')
  logout(@Req() request: FastifyRequest) {
    return this.userService.logout();
  }

  @Get('/tier')
  appraisalCount(@Req() request: FastifyRequest) {
    return this.userService.appraisalCount();
  }

  @Delete('/withdrawal')
  withdrawal(@Req() request: FastifyRequest) {
    return this.userService.withdrawal();
  }
}

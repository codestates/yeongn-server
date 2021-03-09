import {
  Controller,
  Get,
  Req,
  Post,
  Delete,
  Body,
  Session,
  Res,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from './user.service';
import { AuthorizationCodeDto } from './dto/AuthorizationCode.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/google')
  googleLogin(
    @Body() authorizationCode: AuthorizationCodeDto,
    @Res() reply: FastifyReply,
  ) {
    return this.userService.googleLogin(authorizationCode, reply);
  }

  @Post('/naver')
  naverLogin(
    @Body() authorizationCode: AuthorizationCodeDto,
    @Res() reply: FastifyReply,
  ) {
    return this.userService.naverLogin(authorizationCode, reply);
  }

  @Post('/kakao')
  kakaoLogin(
    @Body() authorizationCode: AuthorizationCodeDto,
    @Res() reply: FastifyReply,
  ) {
    return this.userService.kakaoLogin(authorizationCode, reply);
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

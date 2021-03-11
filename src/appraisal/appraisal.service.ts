import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { JwtService } from 'src/jwt/jwt.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appraisal } from 'src/entity/Appraisal.entity';
import { AppraisalsComment } from 'src/entity/AppraisalsComment.entity';
@Injectable()
export class AppraisalService {
  constructor(
    @InjectRepository(Appraisal)
    private appraisalRepository: Repository<Appraisal>,
    @InjectRepository(AppraisalsComment)
    private commentRepository: Repository<AppraisalsComment>,
    private imageUploadService: ImageUploadService,
    private jwt: JwtService,
  ) {}
  async postAppraisal(req: FastifyRequest, res: FastifyReply) {
    const auth = req.headers['authorization'];
    if (!auth) throw new ForbiddenException();
    const formdata = await req.body;
    const image = formdata['image'];
    const buffer: Buffer = await image.toBuffer();

    const tokenData = await this.jwt.verifyToken(auth.split(' ')[1]);
    try {
      const itemName: string = formdata['title'].value;
      const category: string = formdata['category'].value;
      const description: string = formdata['text'].value;
      const userPrice: string = formdata['price'].value;
      if (!itemName || !category || !description || !userPrice) {
        throw new NotAcceptableException('입력안한값이 있다!');
      }
      const imgUrl = await this.imageUploadService.uploadImage(
        image.filename,
        buffer,
      );
      const userId: number = tokenData['id'];

      const newAppraisal = new Appraisal();

      newAppraisal.itemName = itemName;
      newAppraisal.category = category;
      newAppraisal.description = description;
      newAppraisal.userPrice = userPrice;
      newAppraisal.imgUrl = imgUrl;
      newAppraisal.userId = userId;

      await this.appraisalRepository.save(newAppraisal);

      console.log(newAppraisal);
      res.send({
        appraisalId: newAppraisal.id,
        message: 'created!',
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async deleteAppraisal(
    req: FastifyRequest,
    res: FastifyReply,
    appraisalId: string,
  ) {
    const auth = req.headers['authorization'];
    if (!auth) throw new ForbiddenException();
    const tokenData = await this.jwt.verifyToken(auth.split(' ')[1]);
    const userId = tokenData['id'];

    const targetPost: Appraisal = await this.appraisalRepository.findOne(
      +appraisalId,
    );
    if (!targetPost) {
      throw new NotFoundException('포스트를 찾을수 없음');
    }
    if (targetPost.userId !== userId) {
      throw new NotAcceptableException('권한이 없으셈');
    }
    await this.appraisalRepository.remove(targetPost);
    res.send({
      message: 'deleted!',
    });
  }

  async modifyAppraisal(
    req: FastifyRequest,
    res: FastifyReply,
    appraisalId: string,
  ) {
    const auth = req.headers['authorization'];
    if (!auth) throw new ForbiddenException();
    const tokenData = await this.jwt.verifyToken(auth.split(' ')[1]);
    const userId = tokenData['id'];

    const formdata = await req.body;
    console.log(formdata);
    const image = formdata['image'];
    let imgUrl: string;

    const itemName: string = formdata['title'].value;
    const category: string = formdata['category'].value;
    const description: string = formdata['text'].value;
    const userPrice: string = formdata['price'].value;
    if (!itemName || !category || !description || !userPrice) {
      throw new NotAcceptableException('입력안한값이 있다!');
    }
    if (image) {
      const buffer: Buffer = await image.toBuffer();
      imgUrl = await this.imageUploadService.uploadImage(
        image.filename,
        buffer,
      );
    }

    const targetPost: Appraisal = await this.appraisalRepository.findOne(
      appraisalId,
    );
    if (!targetPost) {
      throw new NotFoundException('포스트를 찾을수 없음');
    }
    if (targetPost.userId !== userId) {
      throw new NotAcceptableException('권한이 없으셈');
    }
    if (imgUrl) {
      await this.appraisalRepository.update(appraisalId, {
        itemName,
        category,
        description,
        userPrice,
        imgUrl,
      });
      res.send({
        message: 'modified :3',
      });
    } else {
      this.appraisalRepository.update(appraisalId, {
        itemName,
        category,
        description,
        userPrice,
      });
      res.send({
        message: 'modified :3',
      });
    }
  }

  async createComment(req: FastifyRequest, res: FastifyReply, appraisalId) {
    const auth = req.headers['authorization'];
    if (!auth) throw new ForbiddenException();
    const tokenData = await this.jwt.verifyToken(auth.split(' ')[1]);
    const userId = tokenData['id'];

    if (!req.body['text']) {
      throw new NotAcceptableException('내용이 없네용..');
    }

    const newComment = new AppraisalsComment();
    newComment.text = req.body['text'];
    newComment.appraisalId = appraisalId;
    newComment.userId = userId;
    await this.commentRepository.save(newComment);

    res.send({
      commentId: newComment.id,
      message: 'created :3',
    });
  }

  async modifyComment(
    req: FastifyRequest,
    res: FastifyReply,
    commentId: string,
  ) {
    const auth = req.headers['authorization'];
    if (!auth) throw new ForbiddenException();
    const tokenData = await this.jwt.verifyToken(auth.split(' ')[1]);
    const userId = tokenData['id'];

    if (!req.body['text']) {
      throw new NotAcceptableException('내용이 없네용..');
    }

    const targetComment = await this.commentRepository.findOne(+commentId);

    if (!targetComment) {
      throw new NotFoundException('못찾겠어용..');
    }

    if (targetComment.userId !== userId) {
      throw new ForbiddenException('권한이 없네용..');
    }

    this.commentRepository.update(+commentId, {
      text: req.body['text'],
    });

    res.send({
      commentId: +commentId,
      message: 'updated :3',
    });
  }

  async deleteComment(
    req: FastifyRequest,
    res: FastifyReply,
    commentId: string,
  ) {
    const auth = req.headers['authorization'];
    if (!auth) throw new ForbiddenException();
    const tokenData = await this.jwt.verifyToken(auth.split(' ')[1]);
    const userId = tokenData['id'];

    const targetComment: AppraisalsComment | null = await this.commentRepository.findOne(
      +commentId,
    );

    if (!targetComment) {
      throw new NotFoundException('못찾겠어용..');
    }

    if (targetComment.userId !== userId) {
      throw new ForbiddenException('권한이 없네용..');
    }

    await this.commentRepository.remove(targetComment);

    res.send({
      removedCommentId: +commentId,
      message: 'removed :3',
    });
  }
}

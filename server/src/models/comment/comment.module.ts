import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentPublicService } from './comment.public';
import { CommentRepository } from './comment.repository';

@Module({
  providers: [PrismaService, CommentService, CommentPublicService, CommentRepository],
  controllers: [CommentController],
  imports: [],
  exports: [CommentPublicService],
})
export class CommentModule {}

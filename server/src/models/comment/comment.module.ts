import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';

@Module({
  providers: [PrismaService, CommentService],
  controllers: [CommentController],
  imports: [],
  exports: [CommentService],
})
export class CommentModule {}

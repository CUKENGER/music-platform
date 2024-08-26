import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async addCommentOrReply(dto: CreateCommentDto) {
    const { parentId, username, text, trackId, artistId } = dto;

    if (parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    try {
      const comment = await this.prisma.comment.create({
        data: {
          username,
          text,
          parentId,
          trackId,
          artistId,
        },
        include: {
          parent: true,
          replies: true,
        },
      });

      return comment;
    } catch (error) {
      throw new HttpException('Error creating comment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteCommentOrReply(commentId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    try {
      return await this.prisma.comment.delete({ where: { id: commentId } });
    } catch (error) {
      throw new HttpException('Error deleting comment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addLike(commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    try {
      const updatedComment = await this.prisma.comment.update({
        where: { id: commentId },
        data: { likes: comment.likes + 1 }, // Увеличиваем количество лайков на 1
      });

      return updatedComment;
    } catch (error) {
      throw new HttpException('Error adding like', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteLike(commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.likes <= 0) {
      throw new HttpException('Cannot remove like, no likes present', HttpStatus.BAD_REQUEST);
    }

    try {
      const updatedComment = await this.prisma.comment.update({
        where: { id: commentId },
        data: { likes: comment.likes - 1 },
      });

      return updatedComment;
    } catch (error) {
      throw new HttpException('Error deleting like', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

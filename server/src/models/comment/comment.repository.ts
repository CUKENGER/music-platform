import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getMany(whereCondition: { trackId: number } | { artistId: number } | { albumId: number }) {
    return await this.prisma.comment.findMany({
      where: {
        ...whereCondition,
        parentId: null,
      },
      include: {
        replies: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        likedByUsers: true,
      },
    });
  }

  async create(dto: CreateCommentDto) {
    return await this.prisma.comment.create({
      data: {
        ...dto,
      },
      include: {
        parent: true,
        replies: true,
      },
    });
  }

  async isExist(parentId: number) {
    return await this.prisma.comment.findUnique({
      where: { id: parentId },
      include: {
        likedByUsers: true,
      }
    });
  }

  async deleteComment(id: number) {
    return await this.prisma.comment.delete({
      where: { id },
    });
  }

  async updateLike(id: number, newLikes: number) {
    return await this.prisma.comment.update({
      where: { id },
      data: { likes: newLikes },
    })
  }

  async deleteManyForArtist(parentId: number) {
    return await this.prisma.comment.deleteMany({
      where: {
        artistId: parentId
      }
    })
  }
}

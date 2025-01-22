import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async getCommentsByEntity(entityType: 'track' | 'artist' | 'album', entityId: any) {
    this.validateEntityType(entityType);
    const id = this.validateEntityId(entityId);

    const whereCondition = this.getWhereConditionByEntity(entityType, id);

    try {
      const comments = await this.prisma.comment.findMany({
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
      return comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new InternalServerErrorException('Error fetching comments');
    }
  }

  async addCommentOrReply(dto: CreateCommentDto) {
    const { parentId, username, text, trackId, artistId, albumId } = dto;

    if (parentId) {
      await this.ensureCommentExists(parentId);
    }

    try {
      const comment = await this.prisma.comment.create({
        data: {
          username,
          text,
          parentId,
          trackId,
          artistId,
          albumId,
        },
        include: {
          parent: true,
          replies: true,
        },
      });

      return comment;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw new InternalServerErrorException('Error creating comment');
    }
  }

  async deleteCommentOrReply(commentId: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    try {
      return await this.prisma.comment.delete({ where: { id: commentId } });
    } catch (error) {
      throw new InternalServerErrorException('Error deleting comment');
    }
  }

  async addLike(id: number, token: string) {
    const user = await this.findUserByToken(token);
    const userId = Number(user.id);
    const comment = await this.ensureCommentExistsWithLikes(id);

    const hasLiked = comment.likedByUsers.some((likedUser) => likedUser.id === userId);

    if (hasLiked) {
      throw new BadRequestException('User has already liked this comment');
    }

    try {
      await this.prisma.comment.update({
        where: { id },
        data: {
          likes: comment.likes + 1,
          likedByUsers: {
            connect: { id: userId },
          },
        },
      });

      return { message: 'Like added' };
    } catch (error) {
      console.error(`Error adding like: ${error}`);
      throw new InternalServerErrorException('Error adding like');
    }
  }

  async deleteLike(id: number, token: string) {
    const user = await this.findUserByToken(token);
    const userId = Number(user.id);
    const comment = await this.ensureCommentExistsWithLikes(id);

    const hasLiked = comment.likedByUsers.some((likedUser) => likedUser.id === userId);

    if (!hasLiked) {
      throw new BadRequestException('User has not liked this comment');
    }

    if (comment.likes <= 0) {
      throw new BadRequestException('Cannot remove like, no likes present');
    }

    try {
      await this.prisma.comment.update({
        where: { id },
        data: {
          likes: comment.likes - 1,
          likedByUsers: {
            disconnect: { id: userId },
          },
        },
      });

      return { message: 'Like removed' };
    } catch (error) {
      console.error(`Error deleting like: ${error}`);
      throw new InternalServerErrorException(`Error deleting like: ${error}`);
    }
  }

  // to getComments
  private validateEntityType(entityType: string) {
    if (!['track', 'artist', 'album'].includes(entityType)) {
      throw new BadRequestException('Invalid entity type');
    }
  }

  private validateEntityId(entityId: any): number {
    const id = entityId && typeof entityId === 'object' ? Number(entityId?.id) : Number(entityId);

    if (isNaN(id)) {
      throw new BadRequestException('Invalid entityId');
    }

    return id;
  }

  private getWhereConditionByEntity(entityType: string, id: number) {
    switch (entityType) {
      case 'track':
        return { trackId: id };
      case 'artist':
        return { artistId: id };
      case 'album':
        return { albumId: id };
      default:
        throw new BadRequestException('Invalid entity type');
    }
  }

  // to add
  private async ensureCommentExists(parentId: number) {
    const parentComment = await this.prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (!parentComment) {
      throw new NotFoundException('Parent comment not found');
    }
  }

  // to likes
  private async ensureCommentExistsWithLikes(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: { likedByUsers: true },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  private async findUserByToken(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { tokens: { some: { accessToken: token } } },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiError } from 'exceptions/api.error';
import { CommentRepository } from './comment.repository';
import { Logger } from 'nestjs-pino';
import { CommentWithLikes } from './types';

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    private readonly commentRepository: CommentRepository,
    private readonly logger: Logger,
  ) {}

  async getCommentsByEntity(entityType: 'track' | 'artist' | 'album', entityId: { id: number }) {
    this.validateEntityType(entityType);
    const id = this.validateEntityId(entityId);

    const whereCondition = this.getWhereConditionByEntity(entityType, id);

    try {
      return await this.commentRepository.getMany(whereCondition);
    } catch (error) {
      this.logger.error('Error fetching comments:', error);
      throw ApiError.InternalServerError('Error fetching comments', error);
    }
  }

  async addCommentOrReply(dto: CreateCommentDto) {
    if (dto.parentId) {
      await this.ensureCommentExists(dto.parentId);
    }

    try {
      return await this.commentRepository.create(dto);
    } catch (error) {
      this.logger.error('Error creating comment:', error);
      throw ApiError.InternalServerError('Error creating comment', error);
    }
  }

  async deleteCommentOrReply(commentId: number) {
    const comment = await this.commentRepository.isExist(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    try {
      return await this.commentRepository.deleteComment(commentId);
    } catch (error) {
      throw ApiError.InternalServerError('Error deleting comment', error);
    }
  }

  async addLike(id: number, token: string) {
    const user = await this.findUserByToken(token);
    const userId = Number(user.id);
    const comment = await this.ensureCommentExistsWithLikes(id);
    if (this.hasUserLikedComment(comment, userId)) {
      throw new HttpException('User has already liked this comment', HttpStatus.BAD_REQUEST);
    }
    const newLikes = comment.likes + 1;
    try {
      return await this.commentRepository.updateLike(id, newLikes);
    } catch (error) {
      this.logger.error(`Error adding like: ${error}`);
      throw ApiError.InternalServerError('Error adding like', error);
    }
  }

  async deleteLike(id: number, token: string) {
    const user = await this.findUserByToken(token);
    const userId = Number(user.id);
    const comment = await this.ensureCommentExistsWithLikes(id);
    if (!this.hasUserLikedComment(comment, userId)) {
      throw new HttpException('User has not liked this comment', HttpStatus.BAD_REQUEST);
    }
    if (comment.likes <= 0) {
      throw ApiError.BadRequest('Cannot remove like, no likes present');
    }
    const newLikes = comment.likes - 1;
    try {
      return await this.commentRepository.updateLike(id, newLikes);
    } catch (error) {
      this.logger.error(`Error deleting like: ${error}`);
      throw ApiError.InternalServerError(`Error deleting like: ${error}`, error);
    }
  }

  private hasUserLikedComment(comment: CommentWithLikes, userId: number): boolean {
    return comment.likedByUsers.some((likedUser) => likedUser.id === userId);
  }

  // to getComments
  private validateEntityType(entityType: string) {
    if (!['track', 'artist', 'album'].includes(entityType)) {
      throw new BadRequestException('Invalid entity type');
    }
  }

  private validateEntityId(entityId: { id: number }): number {
    const id = entityId && typeof entityId === 'object' ? Number(entityId?.id) : Number(entityId);

    if (isNaN(id)) {
      throw new BadRequestException('Invalid entityId');
    }

    return id;
  }

  private getWhereConditionByEntity(
    entityType: string,
    id: number,
  ): { trackId: number } | { artistId: number } | { albumId: number } {
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
  private async ensureCommentExists(parentId: number): Promise<void> {
    const parentComment = await this.commentRepository.isExist(parentId);

    if (!parentComment) {
      throw new HttpException('Parent comment not found', HttpStatus.NOT_FOUND);
    }
  }

  // to likes
  private async ensureCommentExistsWithLikes(id: number): Promise<CommentWithLikes> {
    const comment = await this.commentRepository.isExist(id);

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

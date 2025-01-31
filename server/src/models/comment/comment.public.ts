import { Injectable } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { CommentRepository } from "./comment.repository";
import { ApiError } from "exceptions/api.error";
import { Prisma } from "@prisma/client";


@Injectable()
export class CommentPublicService {
  constructor(
    private readonly commentRepository: CommentRepository,
  ) {}

  async create(dto: CreateCommentDto): Promise<Prisma.CommentGetPayload<{include: {parent: true, replies: true }}>> {
    try {
      return await this.commentRepository.create(dto);
    } catch (error) {
      throw ApiError.InternalServerError('Error creating comment', error);
    }
  }

  async deleteManyForArtist(parentId: number) {
    return await this.commentRepository.deleteManyForArtist(parentId);
  }
}

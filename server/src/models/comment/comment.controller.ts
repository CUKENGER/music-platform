import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { ApiError } from 'exceptions/api.error';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':id/like')
  @ApiOperation({ summary: 'Добавление лайка к комментарию' })
  addLike(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw ApiError.UnauthorizedError();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.UnauthorizedError();
    }

    return this.commentService.addLike(id, token);
  }

  @Delete(':id/like')
  @ApiOperation({ summary: 'Удаление лайка у комментария' })
  deleteLike(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw ApiError.UnauthorizedError();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.UnauthorizedError();
    }

    return this.commentService.deleteLike(id, token);
  }
}

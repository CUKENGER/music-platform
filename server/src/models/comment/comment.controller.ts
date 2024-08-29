import { Controller, Delete, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CommentService } from "./comment.service";



@ApiTags('Comments')
@Controller('/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/like/:id')
  @ApiOperation({ summary: 'Добавление лайка к комменту' })
  addLike(@Param('id') id: number) {
    return this.commentService.addLike(id)
  }

  @Delete('/like/:id')
  @ApiOperation({ summary: 'Удаление лайка у комменту' })
  deleteLike(@Param('id') id: number) {
    return this.commentService.deleteLike(id)
  }

}
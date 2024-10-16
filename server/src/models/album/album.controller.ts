import { Body, Controller, Delete, Get, InternalServerErrorException, Param, ParseIntPipe, Post, Query, Req, UnauthorizedException, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { AlbumService } from "./album.service";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { CreateAlbumCommentDto } from "./dto/create-albumComment.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ApiOperation } from "@nestjs/swagger";
import { ApiError } from "exceptions/api.error";


@Controller('albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'picture', maxCount: 1 },
    { name: 'tracks' }
  ]))
  create(@UploadedFiles() files, @Body() dto: CreateAlbumDto) {
    return this.albumService.create(dto, files)
  }

  @Get()
  @ApiOperation({ summary: 'Получение всех альбомов с пагинацией' })
  getAll(@Query('count') count?: number, @Query('cursor') offset?: number) {
    return this.albumService.getAll(offset, count);
  }


  @Get('search')
  searchByName(
    @Query('query') query: string,
    @Query('count', ParseIntPipe) count: number,
    @Query('offset', ParseIntPipe) offset: number
  ) {
    return this.albumService.searchByName(query, count, offset)
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id) {
    return this.albumService.getOne(id)
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id) {
    return this.albumService.delete(id)
  }

  @Post('comment')
  addComment(@Body() dto: CreateAlbumCommentDto) {
    return this.albumService.addComment(dto)
  }

  @Post(':id/listen')
  addListen(@Param('id', ParseIntPipe) id) {
    return this.albumService.listen(id)
  }

  @Get(`:id/comment`)
  getComments(@Param() id: number) {
    return this.albumService.getComments(id)
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Добавление лайка к альбому по id' })
  addLike(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw ApiError.UnauthorizedError();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.UnauthorizedError();
    }

    return this.albumService.addLike(id, token)
  }

  @Delete(':id/like')
  @ApiOperation({ summary: 'Удаление лайка к альбому по id' })
  deleteLike(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw ApiError.UnauthorizedError();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.UnauthorizedError();
    }

    return this.albumService.deleteLike(id, token)
  }
}
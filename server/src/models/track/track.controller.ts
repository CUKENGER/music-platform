import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UploadedFiles,
  Query,
  ParseIntPipe,
  UseInterceptors,
  Put,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackService } from './track.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateTrackCommentDto } from './dto/create-trackComment-dto';
import { CreateReplyTrackCommentDto } from './dto/create-trackReplyComment.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Track } from '@prisma/client';
import { ApiError } from 'exceptions/api.error';

@ApiTags('Tracks')
@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  @ApiOperation({ summary: 'Создание трека' })
  @ApiBody({ type: CreateTrackDto })
  async create(@UploadedFiles() files, @Body() dto: CreateTrackDto) {
    const { picture, audio } = files;

    if (!audio || !picture) {
      throw new NotFoundException('Audio and picture are required');
    }
    return await this.trackService.create(dto, picture, audio);
  }

  @Get('limit_popular')
  @ApiOperation({ summary: 'Получение популярных треков с ограничением' })
  getLimitPopular() {
    console.log('член');
    return this.trackService.getLimitPopular();
  }

  @Get('all_popular')
  @ApiOperation({ summary: 'Получение всех популярных треков' })
  getAllPopular() {
    console.log('член');
    return this.trackService.getAllPopular();
  }

  @Get('search')
  @ApiOperation({ summary: 'Поиск треков' })
  searchByName(
    @Query('query') query: string,
    @Query('count', ParseIntPipe) count: number,
    @Query('offset', ParseIntPipe) offset: number,
  ) {
    return this.trackService.searchByName(query, count, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение трека по id' })
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.trackService.getOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Получение всех треков с пагинацией' })
  getAll(
    @Query('page', ParseIntPipe) page: number = 0,
    @Query('count', ParseIntPipe) count: number = 20,
    @Query('sortBy') sortBy: string = 'Все',
  ) {
    return this.trackService.getAll(page, count, sortBy);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление трека по id' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.trackService.delete(id);
  }

  @Post('comment')
  @ApiOperation({ summary: 'Создание коммента к треку' })
  addComment(@Body() dto: CreateTrackCommentDto) {
    return this.trackService.addComment(dto);
  }

  @ApiOperation({ summary: 'Создание ответа к комменту трека' })
  @Post('comment/replies')
  addReplyToComment(@Body() dto: CreateReplyTrackCommentDto) {
    return this.trackService.addReplyToComment(dto);
  }

  @Post(':id/listen')
  @ApiOperation({ summary: 'Добавление прослушивания к треку по id' })
  async addListen(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw ApiError.UnauthorizedError();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.UnauthorizedError();
    }
    return this.trackService.listen(id, token);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Добавление лайка к треку по id' })
  addLike(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw ApiError.UnauthorizedError();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.UnauthorizedError();
    }
    return this.trackService.addLike(id, token);
  }

  @Delete(':id/like')
  @ApiOperation({ summary: 'Удаление лайка к треку по id' })
  deleteLike(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw ApiError.UnauthorizedError();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.UnauthorizedError();
    }
    return this.trackService.deleteLike(id, token);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновление трека' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  async updateTrack(
    @Param('id') id,
    @Body() newData: Partial<Track>,
    @UploadedFiles() files,
  ): Promise<Track> {
    const { picture, audio } = files;
    return this.trackService.updateTrack(id, newData, picture, audio);
  }
}

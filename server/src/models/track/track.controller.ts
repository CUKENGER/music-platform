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
  HttpStatus,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackService } from './track.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateTrackCommentDto } from './dto/create-trackComment-dto';
import { CreateReplyTrackCommentDto } from './dto/create-trackReplyComment.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Track } from '@prisma/client';
import { ApiError } from 'exceptions/api.error';
import { Headers } from '@nestjs/common';

@ApiTags('Tracks')
@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Создание нового трека',
    description: 'Создает новый трек с обложкой',
  })
  @ApiBody({
    description: 'Данные для создания трека',
    required: true,
    type: CreateTrackDto,
    examples: {
      example1: {
        summary: 'Пример запроса',
        value: {
          name: 'Track Yura',
          text: 'Track text',
          genre: 'Govnorock',
          artist: 'Yura Hoy',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'Трек успешно создан',
    example: {
      id: 1,
      name: 'Track Yura',
      genre: 'Rock',
      artist: 'Yura Hoy',
    },
  })
  @ApiBadRequestResponse({
    description: 'Некорректные данные или файлы не найдены',
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Audio and picture are require',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутренняя ошибка сервера',
    schema: {
      example: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error creating track',
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles() files: { picture: Express.Multer.File; audio: Express.Multer.File },
    @Body() dto: CreateTrackDto,
  ) {
    console.log('Received DTO:', dto);
    const { picture, audio } = files;

    if (!audio || !picture) {
      throw ApiError.BadRequest('Audio and picture are required');
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
  async addListen(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Headers('authorization') authHeader: string | undefined,
  ) {
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
  addLike(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Headers('authorization') authHeader: string | undefined,
  ) {
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
  deleteLike(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Headers('authorization') authHeader: string | undefined,
  ) {
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        picture: { type: 'string', format: 'binary' },
        audio: { type: 'string', format: 'binary' },
        name: { type: 'string' },
        genre: { type: 'string' },
        duration: { type: 'string' },
        text: { type: 'string' },
        artistId: { type: 'number' },
        albumId: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Трек успешно обновлён',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'My Song' },
        genre: { type: 'string', example: 'Rock' },
        duration: { type: 'string', example: '3:30' },
        picture: { type: 'string', example: '/images/track.jpg' },
        audio: { type: 'string', example: '/audio/track.mp3' },
        text: { type: 'string', example: 'Lyrics...' },
        artistId: { type: 'number', nullable: true, example: 1 },
        albumId: { type: 'number', nullable: true, example: 1 },
        updatedAt: { type: 'string', format: 'date-time', example: '2025-06-15T07:10:00.000Z' },
        listens: { type: 'number', example: 100 },
        likes: { type: 'number', example: 10 },
        createdAt: { type: 'string', format: 'date-time', example: '2025-06-01T07:10:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  async updateTrack(
    @Param('id', ParseIntPipe) id: number,
    @Body() newData: Partial<Track>,
    @UploadedFiles() files: { picture?: Express.Multer.File[]; audio?: Express.Multer.File[] },
  ): Promise<Track> {
    const picture = files.picture?.[0];
    const audio = files.audio?.[0];
    return this.trackService.updateTrack(id, newData, picture, audio);
  }
}

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AlbumService } from './album.service';
import { AlbumType } from '@prisma/client';

@ApiTags('Albums')
@ApiBearerAuth()
@Controller('albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @ApiOperation({
    summary: 'Создание нового альбома',
    description: 'Создает новый альбом с обложкой и треками',
  })
  @ApiBody({
    description: 'Данные для создания альбома',
    required: true,
    type: CreateAlbumDto,
    examples: {
      example1: {
        summary: 'Пример запроса',
        value: {
          name: 'Album Yura',
          description: 'Album description',
          genre: 'Rock',
          releaseDate: '2023-01-19',
          artistId: 1,
          type: AlbumType.ALBUM,
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: "Альбом успешно создан",
    example: {
      id: 1,
      name: 'Album Yura',
      description: 'Album description',
      genre: 'Rock',
      releaseDate: '19 january 1022',
      artist: 'Yura Hoy',
      track_names: ['Hoy', 'Coy'],
      track_texts: ['Hoy singing Bomj', 'Coy jiv you dead'],
      type: AlbumType.ALBUM,
    },
  })
  @ApiBadRequestResponse({
    description: 'Некорректные данные или файлы не найдены',
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Files not found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутренняя ошибка сервера',
    schema: {
      example: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error creating album',
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }, { name: 'tracks' }]))
  create(
    @UploadedFiles() files: { picture: Express.Multer.File[]; tracks: Express.Multer.File[] },
    @Body() dto: CreateAlbumDto,
  ) {
    const pictureFile = files.picture ? files.picture[0] : undefined;
    const tracksFiles = files.tracks || [];
    return this.albumService.create(dto, pictureFile, tracksFiles);
  }

  // @Get()
  // @ApiOperation({
  //   summary: 'Получение всех альбомов ',
  //   description: 'Возвращает список альбомов с сортировкой и пагинацией',
  // })
  // @ApiQuery({
  //   name: 'page',
  //   required: false,
  //   type: Number,
  //   description: 'Номер страницы (по умолчанию 0)',
  // })
  // @ApiQuery({
  //   name: 'count',
  //   required: false,
  //   type: Number,
  //   description: 'Количество альбомов на странице (по умолчанию 20)',
  // })
  // @ApiQuery({
  //   name: 'sortBy',
  //   required: false,
  //   type: Number,
  //   description: 'Тип сортировки (по умолчанию не используется)',
  // })
  // getAll(
  //   @Query('page', ParseIntPipe) page: number = 0,
  //   @Query('count', ParseIntPipe) count: number = 20,
  //   @Query('sortBy', new ParseEnumPipe(AlbumType)) sortBy?: AlbumType,
  // ) {
  // }
  //
  // @Get('limit_popular')
  // @ApiOperation({
  //   summary: 'Получение популярных альбомов с ограничением',
  //   description: 'Возвращает список популярных альбомов с ограничение по количеству',
  // })
  // getLimitPopular() {
  // }
  //
  // @Get('all_popular')
  // @ApiOperation({
  //   summary: 'Получение всех популярных альбомов',
  //   description: 'Возвращает список всех популярных альбомов',
  // })
  // getAllPopular() {
  // }
  //
  // @Get('search')
  // @ApiOperation({
  //   summary: 'Поиск альбомов по названию',
  //   description: 'Возвращает список альбомов по, соответствующих названию',
  // })
  // @ApiQuery({ name: 'query', required: true, type: String, description: 'Название альбома' })
  // @ApiQuery({
  //   name: 'count',
  //   required: false,
  //   type: Number,
  //   description: 'Количество результатов (по умолчанию 10)',
  // })
  // @ApiQuery({
  //   name: 'offset',
  //   required: false,
  //   type: Number,
  //   description: 'Смещение (по умолчанию 0)',
  // })
  // searchByName(
  //   @Query('query') query: string,
  //   @Query('count', ParseIntPipe) count: number,
  //   @Query('offset', ParseIntPipe) offset: number,
  // ) {
  // }
  //
  // @Get(':id')
  // @ApiOperation({
  //   summary: 'Получение альбома по ID',
  //   description: 'Возвращает альбом по его идентификатору.',
  // })
  // @ApiParam({ name: 'id', required: true, type: Number, description: 'ID альбома' })
  // getOne(@Param('id', ParseIntPipe) id: number) {
  // }
  //
  // @Delete(':id')
  // @ApiOperation({
  //   summary: 'Удаление альбома по ID',
  //   description: 'Удаляет альбом по его идентификатору.',
  // })
  // @ApiParam({ name: 'id', required: true, type: Number, description: 'ID альбома' })
  // delete(@Param('id', ParseIntPipe) id: number) {
  // }
  //
  // @Post('comment')
  // @ApiOperation({
  //   summary: 'Добавление комментария к альбому',
  //   description: 'Добавляет комментарий к альбому.',
  // })
  // @ApiBody({ type: CreateAlbumCommentDto })
  // addComment(@Body() dto: CreateAlbumCommentDto) {
  // }
  //
  // @Post(':id/listen')
  // @ApiOperation({
  //   summary: 'Добавление прослушивания альбома',
  //   description: 'Увеличивает счетчик прослушиваний альбома.',
  // })
  // @ApiParam({ name: 'id', required: true, type: Number, description: 'ID альбома' })
  // addListen(@Param('id', ParseIntPipe) id: number) {
  // }
  //
  // @Get(`:id/comment`)
  // @ApiOperation({
  //   summary: 'Получение комментариев альбома',
  //   description: 'Возвращает список комментариев для альбома.',
  // })
  // @ApiParam({ name: 'id', required: true, type: Number, description: 'ID альбома' })
  // getComments(@Param() id: number) {
  // }
  //
  // @Post(':id/like')
  // @ApiOperation({
  //   summary: 'Добавление лайка к альбому',
  //   description: 'Добавляет лайк к альбому по его идентификатору.',
  // })
  // @ApiParam({ name: 'id', required: true, type: Number, description: 'ID альбома' })
  // @ApiOperation({ summary: 'Добавление лайка к альбому по id' })
  // addLike(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
  //   const authHeader = req.headers['authorization'];
  //
  //   if (!authHeader) {
  //     throw ApiError.UnauthorizedError();
  //   }
  //
  //   const token = authHeader.split(' ')[1];
  //   if (!token) {
  //     throw ApiError.UnauthorizedError();
  //   }
  //
  // }
  //
  // @Delete(':id/like')
  // @ApiOperation({ summary: 'Удаление лайка у альбома', description: 'Удаляет лайк у альбома по его идентификатору.' })
  // @ApiParam({ name: 'id', required: true, type: Number, description: 'ID альбома' })
  // @ApiOperation({ summary: 'Удаление лайка к альбому по id' })
  // deleteLike(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
  //   const authHeader = req.headers['authorization'];
  //   if (!authHeader) {
  //     throw ApiError.UnauthorizedError();
  //   }
  //
  //   const token = authHeader.split(' ')[1];
  //   if (!token) {
  //     throw ApiError.UnauthorizedError();
  //   }
  //
  // }
  //
  // @Put(':id')
  // @ApiOperation({ summary: 'Обновление альбома', description: 'Обновляет данные альбома, включая изображение и треки.' })
  // @ApiParam({ name: 'id', required: true, type: Number, description: 'ID альбома' })
  // @ApiBody({ type: CreateAlbumDto })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(
  //   FileFieldsInterceptor([
  //     { name: 'picture', maxCount: 1 },
  //     ...Array.from({ length: 1000 }, (_, i) => ({ name: `tracks[${i}][audio]`, maxCount: 1 })),
  //     { name: 'newTracks' },
  //   ]),
  // )
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() dto: UpdateAlbumDto,
  //   @UploadedFiles() files,
  // ) {
  //   const { pictureFile, newTracks, ...tracks } = files;
  //
  //   const tracksFiles = Object.values(tracks).flat();
  //
  // }
}

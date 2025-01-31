import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateArtistDto } from './dto/create-artist.dto';
import { CreateArtistCommentDto } from './dto/create-artistComment.dto';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artists')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @ApiCreatedResponse()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  async create(@UploadedFiles() files: {picture: Express.Multer.File}, @Body() dto: CreateArtistDto) {
    const { picture } = files;
    this.logger.log('files', files);
    return this.artistService.create(dto, picture);
  }

  @Get()
  @ApiOperation({ summary: 'Получение всех артистов с пагинацией' })
  getAllPage(
    @Query('page', ParseIntPipe) page: number = 0,
    @Query('count', ParseIntPipe) count: number = 20,
    @Query('sortBy') sortBy: string = 'Все',
  ) {
    return this.artistService.getAllPage(page, count, sortBy);
  }

  @Get('/all')
  @ApiOperation({ summary: 'Получение всех артистов с пагинацией' })
  async getAll() {
    return await this.artistService.getAll();
  }

  @Get('search')
  searchByName(@Query('name') name: string) {
    console.log('name', name);
    return this.artistService.searchByName(name);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.artistService.getOne(id);
  }

  @Get(':id/popular_tracks')
  getPopularTracks(@Param('id', ParseIntPipe) id: number) {
    return this.artistService.getPopularTracks(id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.artistService.delete(id);
  }

  @Post('comment')
  addComment(@Body() dto: CreateArtistCommentDto) {
    return this.artistService.addComment(dto);
  }

  @Post(':id/listen')
  addListen(@Param('id', ParseIntPipe) id: number) {
    return this.artistService.listen(id);
  }

  @Post(':id/like')
  addLike(@Param('id', ParseIntPipe) id: number) {
    return this.artistService.updateLike(id, true);
  }

  @Delete(':id/like')
  deleteLike(@Param('id', ParseIntPipe) id: number) {
    return this.artistService.updateLike(id, false);
  }

  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  async updateArtist(@Param('id', ParseIntPipe) id: number, @Body() newData: Partial<UpdateArtistDto>, @UploadedFiles() files: {picture: Express.Multer.File}) {
    const picture = files?.picture ? files?.picture[0] : null;
    return this.artistService.updateArtist(id, newData, picture);
  }
}

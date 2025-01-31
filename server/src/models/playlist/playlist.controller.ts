import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { ApiHeader, ApiOperation } from '@nestjs/swagger';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AddTrackToPlaylistDto } from './dto/add-track-playlist.dto';
import { Logger } from 'nestjs-pino';

@Controller('playlists')
export class PlaylistController {
  constructor(
    private playlistService: PlaylistService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer токен',
    required: true,
  })
  create(@Headers('Authorization') authHeader: string, @Body() dto: CreatePlaylistDto) {
    const token = authHeader.split(' ')[1];
    return this.playlistService.create(token, dto);
  }

  @Post('track')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }, { name: 'tracks' }]))
  addTrackToPlaylist(@UploadedFiles() files: File[], dto: AddTrackToPlaylistDto) {
    return this.playlistService.addTrackToPlaylist(dto, files);
  }

  @Get()
  @ApiOperation({ summary: 'Получение всех плейлистов с пагинацией' })
  getAll(
    @Query('page', ParseIntPipe) page: number = 0,
    @Query('count', ParseIntPipe) count: number = 20,
    @Query('sortBy') sortBy: string = 'Все',
  ) {
    this.logger.log(`PlaylistController getAll page: ${page}, count: ${count}, sortBy: ${sortBy}`);
    // return this.playlistService.getAll(page, count, sortBy);
  }
}

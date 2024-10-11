import { Controller, Get, Query } from '@nestjs/common';
import { LyricsService } from './lyrics.service';

@Controller('lyrics')
export class LyricsController {
  constructor(private readonly lyricsService: LyricsService) {}

  @Get('/search')
  async searchTrack(@Query('track_name') trackName: string, @Query('artist_name') artistName: string) {
    return await this.lyricsService.searchTrack(trackName, artistName);
  }

  @Get()
  async getLyrics(@Query('track_id') trackId: number) {
    return await this.lyricsService.getLyrics(trackId);
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { LyricsService } from './lyrics.service';

@Controller('lyrics')
export class LyricsController {
  constructor(private readonly lyricsService: LyricsService) {}

  @Get('/search')
  async searchTrack(@Query('track_name') trackName: string, @Query('artist_name') artistName: string) {
    try {
      console.log('SearchTracklyrics')
      return await this.lyricsService.searchTrack(trackName, artistName);
    } catch(e) {
      console.error('Error search track for lyrics', e)
    }
  }

  @Get()
  async getLyrics(@Query('track_id') trackId: number) {
    try{
      console.log('getLyrics')
      return await this.lyricsService.getLyrics(trackId);
    } catch(e) {
      console.error('Error getLyrics', e)
    }
  }
}

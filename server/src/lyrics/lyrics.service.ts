import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class LyricsService {
  private readonly API_KEY = 'ed2f1c5e22a4e1257849c02412ee4c9c';
  private readonly BASE_URL = 'https://api.musixmatch.com/ws/1.1';

  constructor(private httpService: HttpService) {}

  async searchTrack(trackName: string, artistName: string) {
    const params = {
      apikey: this.API_KEY,
      q_track: trackName,
      q_artist: artistName,
      format: 'json',
      page_size: 1,
    };

    try {
      const response = await this.httpService.get(`${this.BASE_URL}/track.search`, { params }).toPromise();
      const trackInfo = response.data.message.body.track_list[0].track;
      return {
        track_id: trackInfo.track_id,
        track_name: trackInfo.track_name,
        artist_name: trackInfo.artist_name,
        track_genre: trackInfo.track_genre ? trackInfo.track_genre : null
        // Добавьте другие поля, если необходимо
      };
    } catch (error) {
      throw new Error(`Failed to search track: ${error.message}`);
    }
  }

  async getLyrics(trackId: number) {
    const params = {
      apikey: this.API_KEY,
      track_id: trackId,
      format: 'json',
    };

    try {
      const response = await this.httpService.get(`${this.BASE_URL}/track.lyrics.get`, { params }).toPromise();
      const lyrics = response.data.message.body.lyrics.lyrics_body;
      return lyrics.substring(0, lyrics.lastIndexOf('...')).trim(); // Очистка текста от метаинформации в конце
    } catch (error) {
      throw new Error(`Failed to get lyrics: ${error.message}`);
    }
  }
}

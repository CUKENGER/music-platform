import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AudioService } from 'models/audio/audio.service';
import { TrackRepository } from './track.repository';

@Injectable()
export class TrackPublicService {
  constructor(
    private readonly audioService: AudioService,
    private readonly trackRepository: TrackRepository,
  ) {}

  async createMultiple(
    dto: {
      track_names: string[];
      track_texts: string[];
      genre: string;
    },
    tracksPath: string[],
    imagePath: string,
    artistId: number,
    albumId: number,
    prisma: Prisma.TransactionClient,
  ): Promise<number> {
    let totalDuration = 0;

    for (let i = 0; i < dto.track_names.length; i++) {
      // const duration = await this.audioService.getAudioDuration(path.resolve(__dirname, '../../../../', 'server/static', tracksPath[i]));
      // const durationInNum = await this.audioService.getAudioDurationInNum(path.resolve(__dirname, '../../../../', 'server/static', tracksPath[i]));
      const duration = await this.audioService.getAudioDuration(tracksPath[i]);
      const durationInNum = await this.audioService.getAudioDurationInNum(tracksPath[i]);
      totalDuration += durationInNum;

      const trackText = dto.track_texts[i].trim() ? dto.track_texts[i] : 'Текст отсутствует'

      const trackDto = {
        name: dto.track_names[i],
        text: trackText,
        genre: dto.genre,
        artist: '',
      }

      await this.trackRepository.create(
        trackDto,
        tracksPath[i], 
        duration, 
        imagePath, 
        prisma,
        artistId,
        albumId 
      )
    }

    return totalDuration;
  }
}

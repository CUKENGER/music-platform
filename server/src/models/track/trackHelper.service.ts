import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { Album, Prisma, Track } from '@prisma/client';
import { CreateTrackDto } from './dto/create-track.dto';
import { AlbumPublicService } from 'models/album/album.public';
import { ArtistPublicService } from 'models/artist/artist.public';
import { Logger } from 'nestjs-pino';
import { TrackRepository } from './track.repository';
import { STATIC_FILES_PATH } from 'constants/paths';
import { UserPublicService } from 'models/user/userPublic.service';

@Injectable()
export class TrackHelperService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly albumPublicService: AlbumPublicService,
    private readonly artistPublicService: ArtistPublicService,
    private readonly userPublicService: UserPublicService,
    private readonly trackRepository: TrackRepository,
    private readonly logger: Logger,
  ) {}

  async createSingleAlbum(
    genre: string,
    name: string,
    picture: string,
    artistId: number,
  ): Promise<Album> {
    const albumDto = {
      releaseDate: new Date().toISOString(),
      description: '',
      genre,
      name,
    };
    return await this.albumPublicService.createSingleAlbum(
      albumDto,
      picture,
      artistId,
      this.prisma,
    );
  }

  async createTrack(
    dto: CreateTrackDto,
    audioPath: string,
    imagePath: string,
    duration: string,
    prisma: Prisma.TransactionClient,
    artistId?: number,
    albumId?: number,
  ): Promise<Track> {
    return await this.trackRepository.create(
      dto,
      audioPath,
      duration,
      imagePath,
      prisma,
      artistId,
      albumId,
    );
  }

  // to delete
  async findTrackById(id: number) {
    const track = await this.trackRepository.findById(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return track;
  }

  async deleteTrackFiles(track: Track): Promise<void> {
    if (track.picture) {
      const picturePath = path.resolve(STATIC_FILES_PATH, track.picture);
      this.logger.log('picturePath', picturePath);
      if (fs.existsSync(picturePath)) {
        fs.unlinkSync(picturePath);
      } else {
        this.logger.log(`Файл с изображением не найден: ${picturePath}`);
      }
    }
    if (track.audio) {
      const audioPath = path.resolve(STATIC_FILES_PATH, track.audio);
      this.logger.log('audioPath', audioPath);
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      } else {
        this.logger.log(`Файл с аудио не найден: ${audioPath}`);
      }
    }
  }

  // to listen
  async getUserFromToken(token: string) {
    return await this.userPublicService.getByToken(token);
  }

  async updateAlbumAndArtistListens(track, updateData) {
    const listens = track.listens + 1;
    if (track.album) {
      await this.albumPublicService.addListen(track.album.id, listens, this.prisma);
    }
    if (track.artist) {
      await this.artistPublicService.addListen(track.artist.id, listens, this.prisma);
    }
    await this.trackRepository.update(track.id, updateData)
  }

  // to likes
  async getUserFromTokenByAccessToken(token: string) {
    return await this.userPublicService.getByToken(token);
  }

  async getTrackWithLikes(trackId: number) {
    return await this.trackRepository.findById(trackId);
  }
}

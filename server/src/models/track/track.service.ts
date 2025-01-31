import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateTrackCommentDto } from './dto/create-trackComment-dto';
import { CreateReplyTrackCommentDto } from './dto/create-trackReplyComment.dto';
import { PrismaService } from 'prisma/prisma.service'; import { FileService } from 'models/file/file.service';
import { Track } from '@prisma/client';
import { TrackHelperService } from './trackHelper.service';
import * as path from 'path';
import * as fs from 'fs';
import { ArtistPublicService } from 'models/artist/artist.public';
import { ApiError } from 'exceptions/api.error';
import { AlbumPublicService } from 'models/album/album.public';
import { Logger } from 'nestjs-pino';
import { STATIC_FILES_PATH } from 'constants/paths';
import { FileType } from 'models/file/types';
import { TrackRepository } from './track.repository';
import { AudioService } from 'models/audio/audio.service';
import { FeaturedArtistPublicService } from 'models/featuredArtist/featuredArtistPublic.service';

@Injectable()
export class TrackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService, 
    private readonly audioService: AudioService,
    private readonly trackHelperService: TrackHelperService,
    private readonly artistPublicService: ArtistPublicService,
    private readonly albumPublicService: AlbumPublicService,
    private readonly featuredPublicArtistService: FeaturedArtistPublicService,
    private readonly trackRepository: TrackRepository,
    private readonly logger: Logger,
  ) {}

  async create(dto: CreateTrackDto, picture: Express.Multer.File, audio: Express.Multer.File) {
    if (!picture || !audio) {
      throw ApiError.BadRequest('Files not found');
    }

    let audioPath: string = '';
    let imagePath: string = '';
    try {
      audioPath = await this.fileService.createFile(FileType.AUDIO, audio);
      imagePath = await this.fileService.createFile(FileType.IMAGE, picture);
      this.logger.log(`audioPath: ${audioPath}\n imagePath: ${imagePath}`);
      const duration = await this.audioService.getAudioDuration(
        path.resolve(STATIC_FILES_PATH, audioPath),
      );
      const artist = await this.artistPublicService.findOrCreateArtist(
        { artist: dto.artist, genre: dto.genre },
        imagePath,
        this.prisma,
      );
      const albumDto = {
        genre: dto.genre,
        name: dto.name,
        description: '',
        releaseDate: new Date().toISOString(),
      }
      const album = await this.albumPublicService.createSingleAlbum(
        albumDto,
        imagePath,
        artist.id,
        this.prisma,
      );
      const newTrack = await this.trackHelperService.createTrack(
        dto,
        audioPath,
        imagePath,
        duration,
        this.prisma,
        artist.id,
        album.id,
      );
      if (dto.featArtists && dto.featArtists.length > 0) {
        for (const featArtistName of dto.featArtists) {
          await this.featuredPublicArtistService.findOrCreateArtist(
            { artist: featArtistName, genre: dto.genre },
            imagePath,
            album.id,
            this.prisma,
          );
        }
      }

      return newTrack;
    } catch (error) {
      if (imagePath && fs.existsSync(imagePath)) {
        this.fileService.cleanupFile(imagePath);
      }
      if (audioPath && fs.existsSync(audioPath)) {
        this.fileService.cleanupFile(audioPath);
      }
      console.error('Error creating track:', error);
      throw ApiError.InternalServerError(`Error creating track: ${error}`, error);
    }
  }

  async getOne(id: number): Promise<Track> {
    const track = await this.trackRepository.findById(id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return track;
  }

  async getAll(page: number, count: number, sortBy: string) {
    const limit = count;
    const offset = page * limit;
    let orderBy: Record<string, 'asc' | 'desc'> = {};

    switch (sortBy) {
      case 'Все':
        orderBy = { id: 'desc' };
        break;
      case 'По алфавиту':
        orderBy = { name: 'asc' };
        break;
      case 'Популярные':
        orderBy = { listens: 'desc' };
        break;
      default:
        orderBy = { id: 'asc' };
    }

    try {
      return await this.trackRepository.getByPageCountSort(offset, limit, orderBy);
    } catch (e) {
      console.error(`Error get All:`, e);
      throw ApiError.InternalServerError('Error get All', e);
    }
  }

  async delete(id: number): Promise<Track | null> {
    const track = await this.trackHelperService.findTrackById(id);
    await this.trackHelperService.deleteTrackFiles(track);
    await this.prisma.comment.deleteMany({ where: { trackId: Number(id) } });
    await this.prisma.listenedTrack.deleteMany({ where: { trackId: Number(id) } });
    const albumId = track.albumId;
    await this.trackRepository.delete(id);
    if (albumId) {
      const remainingTracks = await this.trackRepository.getCountByAlbumId(albumId);
      if (remainingTracks === 0) {
        await this.albumPublicService.deleteAlbum(albumId);
      }
      return track;
    } else {
      return null;
    }
  }

  async updateTrack(
    id: number,
    newData: Partial<Track>,
    picture?: Express.Multer.File,
    audio?: Express.Multer.File,
  ): Promise<Track> {
    const entityToUpdate = await this.trackHelperService.findTrackById(id);
    if (picture) {
      newData.picture = await this.fileService.createFile(FileType.IMAGE, picture);
    }
    if (audio) {
      const audioPath = await this.fileService.createFile(FileType.AUDIO, audio);
      newData.audio = audioPath;
      newData.duration = await this.audioService.getAudioDuration(audioPath);
    }
    newData.updatedAt = new Date();
    const updateData = {
      name: newData.name || entityToUpdate.name,
      genre: newData.genre || entityToUpdate.genre,
      duration: newData.duration || entityToUpdate.duration,
      picture: newData.picture || entityToUpdate.picture,
      audio: newData.audio || entityToUpdate.audio,
      text: newData.text || entityToUpdate.text,
      artistId: newData.artistId || entityToUpdate.artistId,
      albumId: newData.albumId || entityToUpdate.albumId,
      updatedAt: newData.updatedAt,
    };
    return await this.trackRepository.update(id, updateData);
  }

  async addComment(dto: CreateTrackCommentDto) {
    const track = await this.trackHelperService.findTrackById(dto.trackId);
    this.logger.log(`add comment to track: ${track}`);
    // return await this.commentService.addCommentOrReply({
    //   ...dto,
    //   trackId: track.id,
    // });
  }

  async addReplyToComment(dto: CreateReplyTrackCommentDto) {
    this.logger.log(`add reply to comment: ${dto}`);
    // return await this.commentService.addCommentOrReply({
    //   ...dto,
    //   parentId: dto.parentId,
    // });
  }

  async listen(trackId: number, token: string): Promise<number> {
    const user = await this.trackHelperService.getUserFromToken(token);
    const track = await this.trackHelperService.findTrackById(trackId);
    const updateData = { listens: track.listens + 1 };
    await this.trackHelperService.updateAlbumAndArtistListens(track, updateData);
    await this.trackRepository.addListenedTrack(user.id, track.id);
    return track.id;
  }

  async searchByName(query: string, count: number, offset: number): Promise<Track[]> {
    return await this.trackRepository.searchCountOffset(query, count, offset);
  }

  async addLike(trackId: number, token: string) {
    const user = await this.trackHelperService.getUserFromTokenByAccessToken(token);
    const track = await this.trackHelperService.findTrackById(trackId);
    const isLiked = await this.trackRepository.isLiked(track, user.id);
    if (isLiked) {
      throw new BadRequestException('Track already liked by this user');
    }
    await this.prisma.$transaction(async (prisma) => {
      await this.trackRepository.updateLike(trackId, user.id, true, prisma);
    });
    return await this.trackHelperService.getTrackWithLikes(trackId);
  }

  async deleteLike(trackId: number, token: string) {
    const user = await this.trackHelperService.getUserFromTokenByAccessToken(token);
    const track = await this.trackHelperService.findTrackById(trackId);
    const isLiked = await this.trackRepository.isLiked(track, user.id);
    if (!isLiked) {
      throw new BadRequestException('Track not liked by this user');
    }
    await this.prisma.$transaction(async (prisma) => {
      await this.trackRepository.updateLike(track.id, user.id, false, prisma);
    });
    return await this.trackHelperService.getTrackWithLikes(trackId);
  }

  async getLimitPopular() {
    try {
      return await this.trackRepository.getLimitPopular()
    } catch (e) {
      console.error(`Error get limit popular tracks:`, e);
      throw ApiError.InternalServerError(`Error get limit popular tracks:`, e);
    }
  }

  async getAllPopular() {
    try {
      return await this.trackRepository.getAllPopular() 
    } catch (e) {
      console.error('Error get all popular tracks:', e);
      throw ApiError.InternalServerError('Error get all popular tracks:', e);
    }
  }
}

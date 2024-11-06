import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateTrackCommentDto } from './dto/create-trackComment-dto';
import { CreateReplyTrackCommentDto } from './dto/create-trackReplyComment.dto';
import { PrismaService } from 'prisma/prisma.service';
import { FileService, FileType } from 'models/file/file.service';
import { AudioService } from 'models/audioService/audioService.service';
import { Album, Artist, Track, User } from '@prisma/client';
import { CommentService } from 'models/comment/comment.service';
import { TrackHelperService } from './trackHelper.service';
import * as path from "path";

@Injectable()
export class TrackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
    private readonly audioService: AudioService,
    private readonly commentService: CommentService,
    private trackHelperService: TrackHelperService
  ) { }

  async create(dto: CreateTrackDto, picture: Express.Multer.File, audio: Express.Multer.File) {
    if (!picture || !audio) {
      throw new NotFoundException('Files not found');
    }

    let audioPath: string;
    let imagePath: string;
    try {
      audioPath = await this.fileService.createFile(FileType.AUDIO, audio)
      imagePath = await this.fileService.createFile(FileType.IMAGE, picture)
      console.log(`audioPath: ${audioPath}\n imagePath: ${imagePath}`)
      const duration = await this.audioService.getAudioDuration(path.resolve(__dirname, '../../../../', 'server/static', audioPath));
      const artist = await this.trackHelperService.getOrCreateArtist(dto.artist, dto.genre, picture);

      const album = await this.prisma.album.create({
        data: {
          description: '',
          genre: dto.genre,
          name: dto.name,
          picture: imagePath,
          releaseDate: new Date().toISOString(),
          artist: { connect: { id: artist.id } },
          createdAt: new Date(),
          type: 'SINGLE',
        },
      });

      const newTrack = await this.prisma.track.create({
        data: {
          ...dto,
          audio: audioPath,
          picture: imagePath,
          duration,
          artist: { connect: { id: artist.id } },
          album: { connect: { id: album.id } },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return newTrack;
    } catch (error) {
      this.fileService.cleanupFile(imagePath);
      this.fileService.cleanupFile(audioPath)
      console.error('Error creating track:', error);
      throw new Error(`Error creating track: ${error}`)
    }
  }

  async getOne(id: number): Promise<Track & { likedByUsers: User[]; album: Album; artist: Artist }> {
    const track = await this.prisma.track.findUnique({
      where: { id: Number(id) },
      include: {
        comments: { include: { replies: true } },
        album: true,
        artist: true,
        likedByUsers: true,
        listenedByUsers: true,
      },
    });

    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    return track;
  }

  async getAll(page: number, count: number) {
    const limit = count;
    const offset = page * limit;
    try {
      return await this.prisma.track.findMany({
        skip: offset,
        take: Number(limit),
        include: {
          artist: true,
          album: true,
        comments: true,
          likedByUsers: true,
          listenedByUsers: true,
        },
      });
    } catch (e) {
      console.error(`Error get All:`, e)
    }
  }

  async delete(id: number): Promise<Track> {
    const track = await this.trackHelperService.findTrackById(id);

    await this.trackHelperService.deleteTrackFiles(track);
    await this.prisma.comment.deleteMany({ where: { trackId: Number(id) } });
    await this.prisma.listenedTrack.deleteMany({ where: { trackId: Number(id) } });
    const albumId = track.albumId;
    await this.prisma.track.delete({
      where: { id: Number(id) },
    });
    const remainingTracks = await this.prisma.track.count({ where: { albumId: albumId } });
    if (remainingTracks === 0) {
      await this.prisma.album.delete({
        where: { id: albumId },
      });
    }

    return track;
  }

  async updateTrack(
    id: number,
    newData: Partial<Track>,
    picture?: Express.Multer.File,
    audio?: Express.Multer.File
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

    return await this.prisma.track.update({
      where: { id: Number(id) },
      data: updateData,
    });
  }

  async addComment(dto: CreateTrackCommentDto) {
    const track = await this.trackHelperService.findTrackById(dto.trackId);
    return await this.commentService.addCommentOrReply({
      ...dto,
      trackId: track.id,
    });
  }

  async addReplyToComment(dto: CreateReplyTrackCommentDto) {
    return await this.commentService.addCommentOrReply({
      ...dto,
      parentId: dto.parentId,
    });
  }

  async listen(trackId: number, token: string): Promise<number> {
    const user = await this.trackHelperService.getUserFromToken(token);
    const track = await this.trackHelperService.findTrackById(trackId);

    const updateData: any = { listens: track.listens + 1 };
    await this.trackHelperService.updateAlbumAndArtistListens(track, updateData);

    await this.prisma.listenedTrack.create({
      data: {
        userId: user.id,
        trackId: track.id,
        listenedAt: new Date(),
      },
    });

    return track.id;
  }

  async searchByName(query: string, count: number, offset: number): Promise<Track[]> {
    return await this.prisma.track.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      skip: offset,
      take: count,
      include: {
        comments: { include: { replies: true } },
        album: true,
      },
    });
  }

  async addLike(trackId: number, token: string) {
    const user = await this.trackHelperService.getUserFromTokenByAccessToken(token);
    const track = await this.trackHelperService.findTrackById(trackId);

    if (track.likedByUsers.some((likedUser) => likedUser.id === user.id)) {
      throw new BadRequestException('Track already liked by this user');
    }

    await this.prisma.$transaction(async (prisma) => {
      await prisma.track.update({
        where: { id: trackId },
        data: {
          likedByUsers: { connect: { id: user.id } },
          likes: { increment: 1 },
        },
      });
    });

    return await this.trackHelperService.getTrackWithLikes(trackId);
  }

  async deleteLike(trackId: number, token: string) {
    const user = await this.trackHelperService.getUserFromTokenByAccessToken(token);
    const track = await this.trackHelperService.findTrackById(trackId);

    if (!track.likedByUsers.some((likedUser) => likedUser.id === user.id)) {
      throw new BadRequestException('Track not liked by this user');
    }

    await this.prisma.$transaction(async (prisma) => {
      await prisma.track.update({
        where: { id: trackId },
        data: {
          likedByUsers: { disconnect: { id: user.id } },
          likes: { decrement: 1 },
        },
      });
    });

    return await this.trackHelperService.getTrackWithLikes(trackId);
  }






}

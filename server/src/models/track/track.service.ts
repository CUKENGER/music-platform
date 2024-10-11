import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import * as fs from 'fs';
import * as path from 'path';
import { CreateTrackCommentDto } from './dto/create-trackComment-dto';
import { CreateReplyTrackCommentDto } from './dto/create-trackReplyComment.dto';
import { PrismaService } from 'prisma/prisma.service';
import { FileService, FileType } from 'models/file/file.service';
import { AudioService } from 'models/audioService/audioService.service';
import { Album, Artist, Track, User } from '@prisma/client';
import { CommentService } from 'models/comment/comment.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TrackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
    private readonly audioService: AudioService,
    private readonly commentService: CommentService,
    private readonly jwtService: JwtService
  ) {}

  async create(dto: CreateTrackDto, picture: Express.Multer.File, audio: Express.Multer.File) {
    try {
      const [audioPath, imagePath] = await this.uploadFiles(audio, picture);
      const duration = await this.audioService.getAudioDuration(audioPath);
      const artist = await this.getOrCreateArtist(dto.artist, dto.genre, imagePath);

      const newTrack = await this.prisma.track.create({
        data: {
          ...dto,
          audio: audioPath,
          picture: imagePath,
          duration,
          artist: { connect: { id: artist.id } },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return newTrack;
    } catch (error) {
      console.error('Error creating track:', error);
      throw new InternalServerErrorException('Failed to create track');
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

  async getAll(count?: number) {
    const limit = count ? Number(count) : 20;
    return await this.prisma.track.findMany({
      take: limit,
      include: {
        artist: true,
        album: true,
        comments: true,
        likedByUsers: true,
        listenedByUsers: true,
      },
    });
  }

  async delete(id: number): Promise<Track> {
    const track = await this.findTrackById(id);
    await this.deleteTrackFiles(track);
    await this.prisma.comment.deleteMany({ where: { trackId: Number(id) } });
    return await this.prisma.track.delete({ where: { id: Number(id) } });
  }

  async updateTrack(
    id: number,
    newData: Partial<Track>,
    picture?: Express.Multer.File,
    audio?: Express.Multer.File
  ): Promise<Track> {
    const entityToUpdate = await this.findTrackById(id);
  
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
    const track = await this.findTrackById(dto.trackId);
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
    const user = await this.getUserFromToken(token);
    const track = await this.findTrackById(trackId);
    
    const updateData: any = { listens: track.listens + 1 };
    await this.updateAlbumAndArtistListens(track, updateData);

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
    const user = await this.getUserFromTokenByAccessToken(token);
    const track = await this.findTrackById(trackId);

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

    return await this.getTrackWithLikes(trackId);
  }

  async deleteLike(trackId: number, token: string) {
    const user = await this.getUserFromTokenByAccessToken(token);
    const track = await this.findTrackById(trackId);

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

    return await this.getTrackWithLikes(trackId);
  }

  // to create
  private async uploadFiles(audio: Express.Multer.File, picture: Express.Multer.File): Promise<string[]> {
    return Promise.all([
      this.fileService.createFile(FileType.AUDIO, audio),
      this.fileService.createFile(FileType.IMAGE, picture),
    ]);
  }

  private async getOrCreateArtist(name: string, genre: string, imagePath: string) {
    let artist = await this.prisma.artist.findFirst({ where: { name } });
    if (!artist) {
      artist = await this.prisma.artist.create({
        data: { name, genre, description: '', picture: imagePath },
      });
    }
    return artist;
  }

  // to delete
  private async findTrackById(id: number) {
    const track = await this.prisma.track.findFirst({ 
      where: { id: Number(id) } ,
      include: {
        likedByUsers: true,
        album: true
      },
    });
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return track;
  }

  private async deleteTrackFiles(track: Track): Promise<void> {
    if (track.picture) {
      const picturePath = path.resolve('static/', track.picture);
      fs.unlinkSync(picturePath);
    }

    if (track.audio) {
      const audioPath = path.resolve('static/', track.audio);
      fs.unlinkSync(audioPath);
    }
  }

  // to listen
  private async getUserFromToken(token: string) {
    const decoded = this.jwtService.decode(token) as { id: number };
    const user = await this.prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async updateAlbumAndArtistListens(track, updateData: any) {
    if (track.album) {
      updateData.album = { update: { listens: track.album.listens + 1 } };
    }

    if (track.artist) {
      updateData.artist = { update: { listens: track.artist.listens + 1 } };
    }

    await this.prisma.track.update({
      where: { id: track.id },
      data: updateData,
    });
  }

  // to likes
  private async getUserFromTokenByAccessToken(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { tokens: { some: { accessToken: token } } },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async getTrackWithLikes(trackId: number) {
    return await this.prisma.track.findUnique({
      where: { id: trackId },
      include: { likedByUsers: true, _count: true },
    });
  }
}

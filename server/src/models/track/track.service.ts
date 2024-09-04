import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import * as fs from 'fs';
import * as path from 'path';
import { CreateTrackCommentDto } from './dto/create-trackComment-dto';
import { CreateReplyTrackCommentDto } from './dto/create-trackReplyComment.dto';
import { PrismaService } from 'prisma/prisma.service';
import { FileService, FileType } from 'models/file/file.service';
import { AudioService } from 'models/audioService/audioService.service';
import { Track } from '@prisma/client';
import { CommentService } from 'models/comment/comment.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TrackService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    private audioService: AudioService,
    private commentService: CommentService,
    private jwtService: JwtService
  ) { }

  async create(dto: CreateTrackDto, picture: Express.Multer.File, audio: Express.Multer.File) {
    try {
      const [audioPath, imagePath] = await Promise.all([
        this.fileService.createFile(FileType.AUDIO, audio),
        this.fileService.createFile(FileType.IMAGE, picture),
      ]);

      const duration = await this.audioService.getAudioDuration(audioPath);

      let artist = await this.prisma.artist.findFirst({
        where: { name: dto.artist },
      });

      if (!artist) {
        artist = await this.prisma.artist.create({
          data: {
            name: dto.artist,
            genre: dto.genre,
            description: '',
            picture: imagePath,
          },
        });
      }

      const newTrack = await this.prisma.track.create({
        data: {
          ...dto,
          audio: audioPath,
          picture: imagePath,
          duration,
          artist: {
            connect: { id: artist.id },
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
      });
      return newTrack

    } catch (error) {
      console.error('Error creating track:', error);
      throw new InternalServerErrorException('Failed to create track');
    }
  }

  async getOne(id: number): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: { id: Number(id) },
      include: {
        comments: {
          include: {
            replies: true,
          },
        },
        album: true,
        artist: true,
        likedByUsers: true,
        listenedByUsers: true
      },
    });

    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    console.log('track get One', track)
    return track;
  }

  async getAll(offset?: number, count?: number) {
    const limit = count ? Number(count) : 20;
    const skip = offset ? Number(offset) : 0;

    const tracks = await this.prisma.track.findMany({
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        artist: true,
        album: true,
        comments: true,
        likedByUsers: true,
        listenedByUsers: true
      }
    });
    console.log('trracks', tracks)
    return tracks
  }

  async delete(id: number): Promise<Track> {
    const track = await this.prisma.track.findUnique({ where: { id: Number(id) } });
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    if (track.picture) {
      const picturePath = path.resolve('static/', track.picture);
      fs.unlinkSync(picturePath);
    }

    if (track.audio) {
      const audioPath = path.resolve('static/', track.audio);
      fs.unlinkSync(audioPath);
    }

    await this.prisma.comment.deleteMany({ where: { trackId: Number(id) } });

    await this.prisma.track.delete({ where: { id: Number(id) } });

    return track;
  }

  async updateTrack(id: number, newData: Partial<Track>, picture?: Express.Multer.File, audio?: Express.Multer.File): Promise<Track> {
    const entityToUpdate = await this.prisma.track.findUnique({ where: { id: Number(id) } });
    if (!entityToUpdate) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    if (picture) {
      const imagePath = await this.fileService.createFile(FileType.IMAGE, picture);
      newData.picture = imagePath;
    }

    if (audio) {
      const audioPath = await this.fileService.createFile(FileType.AUDIO, audio);
      const duration = await this.audioService.getAudioDuration(audioPath);
      newData.audio = audioPath;
      newData.duration = duration;
    }

    newData.updatedAt = new Date();

    const updatedTrack = await this.prisma.track.update({
      where: { id: Number(id) },
      data: { ...entityToUpdate, ...newData },
    });

    return updatedTrack;
  }

  async addComment(dto: CreateTrackCommentDto) {
    const track = await this.prisma.track.findUnique({
      where: { id: Number(dto.trackId) },
      include: { comments: true },
    });

    if (!track) {
      throw new NotFoundException(`Track with id ${dto.trackId} not found`);
    }

    const comment = await this.commentService.addCommentOrReply({
      ...dto,
      trackId: track.id,
    });

    return comment;
  }

  async addReplyToComment(dto: CreateReplyTrackCommentDto) {
    const reply = await this.commentService.addCommentOrReply({
      ...dto,
      parentId: dto.parentId
    })
    return reply
  }

  async listen(trackId: number, token: string): Promise<number> {
    try {
      const decoded = this.jwtService.decode(token) as { id: number };
      console.log('decoded', decoded);

      const user = await this.prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const track = await this.prisma.track.findUnique({
        where: { id: trackId },
        include: {
          album: true,
          artist: true,
          comments: true,
        },
      });

      if (!track) {
        throw new NotFoundException(`Track with id ${trackId} not found`);
      }

      const updateData: any = {
        listens: track.listens + 1,
      };

      if (track.album) {
        updateData.album = {
          update: {
            listens: track.album.listens + 1,
          },
        };
      }

      if (track.artist) {
        updateData.artist = {
          update: {
            listens: track.artist.listens + 1,
          },
        };
      }

      const updatedTrack = await this.prisma.track.update({
        where: { id: trackId },
        data: updateData,
      });

      await this.prisma.listenedTrack.create({
        data: {
          userId: user.id,
          trackId: track.id,
          listenedAt: new Date(),
        },
      });

      return updatedTrack.id;
    } catch (e) {
      console.log('Error in listen', e);
      if (e instanceof NotFoundException) {
        throw e;
      } else {
        throw new InternalServerErrorException('Error adding listen to track');
      }
    }
  }

  async searchByName(query: string, count: number, offset: number): Promise<Track[]> {
    return this.prisma.track.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      skip: offset,
      take: count,
      include: {
        comments: {
          include: {
            replies: true,
          },
        },
        album: true,
      },
    });
  }

  async addLike(trackId: number, token: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { tokens: { some: { accessToken: token } } },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userId = Number(user.id);

      const track = await this.prisma.track.findUnique({
        where: { id: trackId },
        include: { likedByUsers: true },
      });

      if (!track) {
        throw new NotFoundException('Track not found');
      }

      if (track.likedByUsers.some((likedUser) => likedUser.id === userId)) {
        throw new BadRequestException('Track already liked by this user');
      }

      await this.prisma.$transaction(async (prisma) => {
        await prisma.track.update({
          where: { id: trackId },
          data: {
            likedByUsers: {
              connect: { id: userId }
            },
            likes: { increment: 1 }
          }
        });
      });

      const likedTrack = await this.prisma.track.findUnique({
        where: {id: trackId},
        include: {
          likedByUsers: true,
          _count: true
        }
      }) 
      return likedTrack

    } catch (e) {
      console.error('Error adding like:', e);
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      } else {
        throw new InternalServerErrorException('Error adding like to track');
      }
    }
  }

  async deleteLike(trackId: number, token: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { tokens: { some: { accessToken: token } } },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userId = Number(user.id);

      const track = await this.prisma.track.findUnique({
        where: { id: trackId },
        include: { likedByUsers: true },
      });

      if (!track) {
        throw new NotFoundException('Track not found');
      }

      if (!track.likedByUsers.some((likedUser) => likedUser.id === userId)) {
        throw new BadRequestException('Track not liked by this user');
      }

      await this.prisma.$transaction(async (prisma) => {
        await prisma.track.update({
          where: { id: trackId },
          data: {
            likedByUsers: {
              disconnect: { id: userId }
            },
            likes: { decrement: 1 }
          }
        });
      });

      const dislikedTrack = await this.prisma.track.findUnique({
        where: {id: trackId},
        include: {
          likedByUsers: true,
          _count: true
        }
      }) 
      return dislikedTrack
    } catch (e) {
      console.error('Error removing like:', e);
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      } else {
        throw new InternalServerErrorException('Error adding like to track');
      }
    }
  }
}
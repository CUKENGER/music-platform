import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class TrackService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    private audioService: AudioService,
    private commentService: CommentService
  ) {}

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
                artistId: artist.id,
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
        artistEntity: true,
      },
    });

    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    return track;
  }

  async delete(id: number): Promise<Track> {
    const track = await this.prisma.track.findUnique({ where: { id } });
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

    await this.prisma.comment.deleteMany({ where: { trackId: id } });

    await this.prisma.track.delete({ where: { id } });

    return track;
  }

  async updateTrack(id: number, newData: Partial<Track>, picture?: Express.Multer.File, audio?: Express.Multer.File): Promise<Track> {
    const entityToUpdate = await this.prisma.track.findUnique({ where: { id } });
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
      where: { id },
      data: { ...entityToUpdate, ...newData },
    });

    return updatedTrack;
  }

  async addComment(dto: CreateTrackCommentDto) {
    const track = await this.prisma.track.findUnique({
      where: { id: dto.trackId },
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

  async listen(id: number): Promise<number> {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (track) {
      const updatedTrack = await this.prisma.track.update({
        where: { id },
        data: { listens: track.listens + 1 },
      });
      return updatedTrack.id;
    } else {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }

  async searchByName(query: string, count: number, offset: number): Promise<Track[]> {
    return this.prisma.track.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive', // Не чувствителен к регистру
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

  async addLike(id: number): Promise<number> {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (track) {
      const updatedTrack = await this.prisma.track.update({
        where: { id },
        data: { likes: track.likes + 1 },
      });
      return updatedTrack.id;
    } else {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }

  async deleteLike(id: number): Promise<number> {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (track) {
      const updatedTrack = await this.prisma.track.update({
        where: { id },
        data: { likes: track.likes - 1 },
      });
      return updatedTrack.id;
    } else {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }
  
}
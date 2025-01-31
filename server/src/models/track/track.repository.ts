import { Injectable } from '@nestjs/common';
import { Prisma, Track } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTrackDto } from './dto/create-track.dto';

@Injectable()
export class TrackRepository {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(
    dto: CreateTrackDto,
    trackPath: string,
    duration: string,
    imagePath: string,
    prisma: Prisma.TransactionClient,
    artistId?: number,
    albumId?: number,
  ): Promise<Track> {
    return await prisma.track.create({
      data: {
        ...dto,
        text: dto.text?.trim() ? dto.text : 'Текст отсутствует',
        duration: duration,
        audio: trackPath,
        picture: imagePath,
        artist: { connect: { id: artistId } },
        album: { connect: { id: albumId } },
      },
    });
  }

  async findById(trackId: number) {
    return await this.prisma.track.findUnique({
      where: { id: trackId },
      include: {
        likedByUsers: true,
        album: true,
        artist: true,
        listenedByUsers: true,
        comments: { include: { replies: true } },
        _count: true,
      },
    });
  }

  async getByPageCountSort(offset: number, limit: number, orderBy: Record<string, 'asc' | 'desc'>) {
    return await this.prisma.track.findMany({
      skip: offset,
      take: limit,
      orderBy: orderBy,
      include: {
        artist: true,
        album: true,
        comments: true,
        likedByUsers: true,
        listenedByUsers: true,
      },
    });
  }

  async delete(trackId: number) {
    return await this.prisma.track.delete({ where: { id: trackId } });
  }

  async getCountByAlbumId(albumId: number) {
    return await this.prisma.track.count({ where: { albumId } });
  }

  async update(trackId: number, updateData: Partial<Track>) {
    return await this.prisma.track.update({
      where: { id: trackId },
      data: updateData,
    });
  }

  async addListenedTrack(userId: number, trackId: number) {
    await this.prisma.listenedTrack.create({
      data: {
        userId: userId,
        trackId: trackId,
        listenedAt: new Date(),
      },
    });
  }

  async searchCountOffset(query: string, count: number, offset: number): Promise<Track[]> {
    return await this.prisma.track.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      skip: offset,
      take: count,
      include: {
        comments: { include: { replies: true } },
        album: true,
      },
    });
  }

  async isLiked(
    track: Prisma.TrackGetPayload<{ include: { likedByUsers: true } }>,
    userId: number,
  ) {
    return track.likedByUsers.some((likedUser) => likedUser.id === userId);
  }

  async updateLike(
    trackId: number,
    userId: number,
    increment: boolean,
    prisma: Prisma.TransactionClient,
  ) {
    return await prisma.track.update({
      where: { id: trackId },
      data: {
        likedByUsers: { connect: { id: userId } },
        likes: { increment: increment ? 1 : -1 },
      },
    });
  }

  async getLimitPopular() {
    return await this.prisma.track.findMany({
      take: 20,
      orderBy: {
        listens: 'asc',
      },
      include: {
        artist: true,
        album: true,
        comments: true,
        likedByUsers: true,
        listenedByUsers: true,
      },
    });
  }

  async getAllPopular() {
    return await this.prisma.track.findMany({
      orderBy: { listens: 'asc' },
      include: {
        artist: true,
        album: true,
        comments: true,
        likedByUsers: true,
        listenedByUsers: true,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist, Prisma } from '@prisma/client';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistWithAllPopularTracks, ArtistWithPopularTracks } from './types';

@Injectable()
export class ArtistRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById (id: number, prisma: Prisma.TransactionClient) {
    return await prisma.artist.findUnique({
      where: { id },
      include: {
        tracks: true,
        albums: true,
        comments: true,
        featuredTracks: true,
        likedByUsers: true,
      }
    })
  }

  async create(dto: CreateArtistDto, imagePath: string, prisma: Prisma.TransactionClient): Promise<Prisma.ArtistGetPayload<{ select: { [K in keyof Required<Prisma.ArtistSelect>]: true } }>> {
    return await prisma.artist.create({
      data: {
        name: dto.name,
        genre: dto.genre,
        description: dto.description,
        picture: imagePath,
      },
      include: {
        tracks: true,
        albums: true,
        comments: true,
        featuredTracks: true,
        likedByUsers: true,
        _count: true,
      },
    });
  }

  async findByName(name: string, prisma: Prisma.TransactionClient): Promise<Prisma.ArtistGetPayload<{ select: { [K in keyof Required<Prisma.ArtistSelect>]: true } }> | null> {
    return await prisma.artist.findFirst({
      where: { name },
      include: {
        tracks: true,
        albums: true,
        comments: true,
        featuredTracks: true,
        likedByUsers: true,
        _count: true
      },
    });
  }

  async getAll() {
    return await this.prisma.artist.findMany({
      include: {
        tracks: true,
        albums: true,
        comments: true,
        likedByUsers: true,
        featuredTracks: true,
      },
    });
  }

  async getByPageCountOrder(
    offset: number,
    limit: number,
    orderBy: Record<string, 'asc' | 'desc'>,
  ) {
    return await this.prisma.artist.findMany({
      skip: offset,
      take: limit,
      orderBy: orderBy,
      include: {
        tracks: true,
        albums: true,
        comments: true,
        likedByUsers: true,
        featuredTracks: true,
      },
    });
  }

  async updateListen(id: number, artist: Artist): Promise<Artist> {
    return await this.prisma.artist.update({
      where: { id },
      data: { listens: artist.listens + 1 },
    });
  }

  async updateLike(id: number, newLikes: number): Promise<Artist> {
    return await this.prisma.artist.update({
      where: { id },
      data: { likes: newLikes },
    });
  }

  async getOne(id: number): Promise<ArtistWithPopularTracks | null> {
    return await this.prisma.artist.findUnique({
      where: { id },
      include: {
        tracks: {
          take: 5,
          orderBy: {
            listens: 'desc',
          },
          include: {
            artist: true,
            likedByUsers: true,
            listenedByUsers: true,
          },
        },
        albums: { include: { tracks: true } },
      },
    });
  }

  async searchByName(name: string): Promise<Artist[]> {
    return await this.prisma.artist.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getWithPopularTracks(id: number): Promise<ArtistWithAllPopularTracks | null> {
    return await this.prisma.artist.findUnique({
      where: { id },
      include: {
        tracks: {
          orderBy: {
            listens: 'desc',
          },
          include: {
            artist: true,
            likedByUsers: true,
            listenedByUsers: true,
          },
        },
      },
    });
  }

  async update(id: number, newData: Partial<UpdateArtistDto>) {
    return await this.prisma.artist.update({
      where: { id },
      data: { ...newData },
    });
  }
}

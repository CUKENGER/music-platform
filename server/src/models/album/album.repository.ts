import { Album, AlbumType, Artist, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AlbumRepository {
  constructor(private readonly prisma: PrismaService) {
    console.log('AlbumRepository: PrismaService внедрён:', !!this.prisma);
    if (!this.prisma) {
      console.error('PrismaService не внедрён!');
      throw new Error('PrismaService не внедрён в AlbumRepository');
    }
  }

  async create(
    dto: {
      genre: string;
      name: string;
      description: string;
      releaseDate: string;
    },
    imagePath: string,
    artistId: number,
    albumType: AlbumType,
    prisma: Prisma.TransactionClient,
  ): Promise<Album> {
    return await prisma.album.create({
      data: {
        name: dto.name,
        genre: dto.genre,
        description: dto.description,
        releaseDate: dto.releaseDate,
        artist: { connect: { id: artistId } },
        picture: imagePath,
        createdAt: new Date(),
        type: AlbumType[albumType],
      },
    });
  }

  async find(dto: CreateAlbumDto, prisma: Prisma.TransactionClient): Promise<Artist | null> {
    const artist = await prisma.artist.findFirst({
      where: { name: dto.artist },
      include: { tracks: true, albums: true },
    });
    if (!artist) {
      return null;
    }
    return artist;
  }

  async update(
    albumId: number,
    albumData: Partial<Album>,
    prisma: Prisma.TransactionClient,
  ): Promise<Album> {
    return await prisma.album.update({
      where: { id: albumId },
      data: { ...albumData },
    });
  }

  async deleteAlbum(albumId: number) {
    return await this.prisma.album.delete({ where: { id: albumId } });
  }

  async getAll({
    page = 0,
    count = 20,
    sortBy = 'Все',
  }: {
    page: number;
    count: number;
    sortBy: string;
  }) {
    try {
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
      const albums = await this.prisma.album.findMany({
        skip: page * count,
        take: count + 1,
        orderBy: orderBy,
        include: {
          artist: { select: { id: true, name: true } },
          tracks: { select: { id: true, name: true, text: true, audio: true } },
        },
      });

      const hasNextPage = albums.length > count;
      return {
        data: albums.slice(0, count),
        hasNextPage,
      };
    } catch (e) {
      console.error('Error repository', e);
      throw e;
    }
  }
}

import { Album, AlbumType, Artist, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';

export class AlbumRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: {
      genre: string;
      name: string;
      description: string;
      releaseDate: string;
    },
    imagePath: string,
    artistId: number,
    albumType: string,
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
        type: albumType as AlbumType,
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
}

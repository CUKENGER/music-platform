import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { CreateArtistCommentDto } from './dto/create-artistComment.dto';
import * as path from 'path';
import * as fs from 'fs/promises';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'prisma/prisma.service';
import { FileService, FileType } from 'models/file/file.service';

@Injectable()
export class ArtistService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async create(dto: CreateArtistDto, picture: Express.Multer.File | string) {
    await this.ensureArtistDoesNotExist(dto.name);

    let imagePath;
    if (picture as Express.Multer.File) {
      imagePath = await this.fileService.createFile(FileType.IMAGE, picture);
    } else {
      imagePath = picture;
    }

    return await this.prisma.artist.create({
      data: {
        ...dto,
        listens: 0,
        likes: 0,
        picture: imagePath,
        tracks: { create: [] },
        albums: { create: [] },
      },
      include: {
        tracks: true,
        albums: true,
      },
    });
  }

  async getAll() {
    return await this.prisma.artist.findMany({
      include: {
        comments: true,
        likedByUsers: true,
        albums: true,
        tracks: true,
      },
    });
  }

  async getAllPage(page: number, count: number, sortBy: string) {
    const limit = count;
    const offset = page * limit;
    let orderBy: any = {};

    switch (sortBy) {
      case 'Все':
        orderBy = { id: 'asc' };
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
      return await this.prisma.artist.findMany({
        skip: offset,
        take: Number(limit),
        orderBy: orderBy,
        include: {
          tracks: true,
          albums: true,
          comments: true,
          likedByUsers: true,
        },
      });
    } catch (e) {
      console.error(`Error get All artists:`, e);
    }
  }

  async listen(id: number) {
    const artist = await this.getArtistById(id);
    return await this.prisma.artist.update({
      where: { id },
      data: { listens: artist.listens + 1 },
    });
  }

  async addLike(id: number) {
    const artist = await this.getArtistById(id);
    return await this.prisma.artist.update({
      where: { id },
      data: { likes: artist.likes + 1 },
    });
  }

  async deleteLike(id: number) {
    const artist = await this.getArtistById(id);
    return await this.prisma.artist.update({
      where: { id },
      data: { likes: artist.likes - 1 },
    });
  }

  async getOne(id: number) {
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

  async addComment(dto: CreateArtistCommentDto) {
    const artist = await this.getArtistById(dto.artistId);
    return await this.prisma.comment.create({
      data: { ...dto, artistId: dto.artistId },
    });
  }

  async delete(id: number) {
    const artist = await this.getArtistById(id);
    await this.removeArtistPicture(artist.picture);

    await this.prisma.comment.deleteMany({ where: { artistId: id } });
    await this.prisma.track.deleteMany({ where: { artistId: id } });
    await this.prisma.album.deleteMany({ where: { artistId: id } });
    await this.prisma.artist.delete({ where: { id } });

    return artist;
  }

  async searchByName(name: string) {
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

  async updateArtist(id: number, newData: Partial<UpdateArtistDto>, picture: Express.Multer.File) {
    let imagePath;
    if (picture) {
      console.log('picture', picture);
      imagePath = await this.fileService.createFile(FileType.IMAGE, picture);
      newData.picture = imagePath;
    }

    console.log('newData', newData);

    return await this.prisma.artist.update({
      where: { id },
      data: { ...newData, picture: imagePath || undefined },
    });
  }

  async getPopularTracks(id: number) {
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

  private async getArtistById(id: number) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    return artist;
  }

  // to create
  private async ensureArtistDoesNotExist(name: string) {
    const existingArtist = await this.prisma.artist.findFirst({ where: { name } });
    if (existingArtist) {
      throw new ConflictException('Artist with this name already exists');
    }
  }

  // to delete
  private async removeArtistPicture(picturePath: string) {
    if (picturePath) {
      try {
        const resolvedPath = path.resolve('static/', picturePath);
        await fs.unlink(resolvedPath);
      } catch (error) {
        console.error(`Error deleting picture: ${error.message}`);
      }
    }
  }
}

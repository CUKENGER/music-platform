import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { CreateArtistCommentDto } from "./dto/create-artistComment.dto";
import * as path from 'path';
import * as fs from 'fs/promises';
import { ArtistFileService, ArtistFileType } from "./artistFile/artistFile.service";
import { UpdateArtistDto } from "./dto/update-artist.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class ArtistService {
  constructor(
    private prisma: PrismaService,
    private artistFileService: ArtistFileService,
  ) { }

  async create(dto: CreateArtistDto, picture: Express.Multer.File) {
    await this.ensureArtistDoesNotExist(dto.name);
    const imagePath = await this.artistFileService.createCover(ArtistFileType.IMAGE, picture);

    return await this.prisma.artist.create({
      data: {
        ...dto,
        listens: 0,
        likes: 0,
        picture: imagePath,
        tracks: { create: [] },
        albums: { create: [] }
      },
      include: {
        tracks: true,
        albums: true,
      }
    });
  }

  async getAll() {
    return await this.prisma.artist.findMany({
      include: {
        comments: true,
        likedByUsers: true,
        albums: true,
        tracks: true
      }
    });

  }

  async getAllCount(count?: number) {
    try {
      const limit = count ? Number(count) : 20;
      return await this.prisma.artist.findMany({
        take: limit,
        include: {
          comments: true,
          likedByUsers: true,
          albums: true,
          tracks: true
        }
      });
    } catch(e) {
      console.error(`Error get artists: ${e}`);
      throw new InternalServerErrorException(`Error get artists: ${e}`)
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
        tracks: true,
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
          mode: "insensitive"
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
  }

  async updateArtist(id: number, newData: Partial<UpdateArtistDto>, picture: Express.Multer.File) {
    let imagePath
    if (picture) {
      imagePath = await this.artistFileService.createCover(ArtistFileType.IMAGE, picture);
      newData.picture = imagePath;
    }

    return await this.prisma.artist.update({
      where: { id },
      data: { ...newData, picture: imagePath || undefined },
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

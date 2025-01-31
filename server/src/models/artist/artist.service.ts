import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { CreateArtistCommentDto } from './dto/create-artistComment.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'prisma/prisma.service';
import { FileService } from 'models/file/file.service';
import { Logger } from 'nestjs-pino';
import { ArtistRepository } from './artist.repository';
import { Artist, Prisma } from '@prisma/client';
import { CommentPublicService } from 'models/comment/comment.public';
import { FileType } from 'models/file/types';

@Injectable()
export class ArtistService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    private artistRepository: ArtistRepository,
    private readonly commentPublicService: CommentPublicService,
    private logger: Logger,
  ) {}

  async create(dto: CreateArtistDto, picture: Express.Multer.File): Promise<Artist> {
    const artist = await this.artistRepository.findByName(dto.name, this.prisma);
    if (artist) {
      throw new HttpException('Artist with this name already exist', HttpStatus.CONFLICT);
    }

    const imagePath = await this.fileService.createFile(FileType.IMAGE, picture);

    return await this.artistRepository.create(dto, imagePath, this.prisma);
  }

  async getAll() {
    return await this.artistRepository.getAll();
  }

  async getAllPage(page: number, count: number, sortBy: string) {
    const limit = count;
    const offset = page * limit;
    let orderBy: Record<string, 'asc' | 'desc'> = {};

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

    await this.artistRepository.getByPageCountOrder(offset, limit, orderBy);
  }

  async listen(id: number) {
    const artist = await this.validateArtist(id);
    return await this.artistRepository.updateListen(id, artist);
  }

  async updateLike(id: number, increment: boolean) {
    const artist = await this.validateArtist(id);
    const newLikes = increment ? artist.likes + 1 : Math.max(artist.likes - 1, 0);
    return await this.artistRepository.updateLike(id, newLikes);
  }

  async getOne(id: number) {
    return await this.artistRepository.getOne(id);
  }

  async addComment(dto: CreateArtistCommentDto): Promise<Prisma.CommentGetPayload<{include: {parent: true, replies: true}}>> {
    const artist = await this.validateArtist(dto.artistId);
    this.logger.log('artist', artist);
    return await this.commentPublicService.create(dto)
  }

  async delete(id: number) {
    const artist = await this.validateArtist(id);

    if (artist.picture) {
      this.removePicture(artist.picture);
    }

    await this.commentPublicService.deleteManyForArtist(id);
    await this.prisma.track.deleteMany({ where: { artistId: id } });
  }

  async searchByName(name: string) {
    return await this.artistRepository.searchByName(name);
  }

  async updateArtist(id: number, newData: Partial<UpdateArtistDto>, picture: Express.Multer.File) {
    let imagePath: string;
    if (picture) {
      this.logger.log('picture', picture);
      imagePath = await this.fileService.createFile(FileType.IMAGE, picture);
      newData.picture = imagePath;
    }

    this.logger.log('newData', newData);

    return await this.artistRepository.update(id, newData);
  }

  async getPopularTracks(id: number) {
    return await this.artistRepository.getWithPopularTracks(id);
  }

  private removePicture(picturePath: string) {
    if (picturePath) {
      try {
        this.fileService.cleanupFile(picturePath);
      } catch (error) {
        this.logger.warn(`Error deleting picture: ${error.message}`);
      }
    }
  }

  private async validateArtist(id: number): Promise<Artist> {
    if (id <= 0) {
      throw new HttpException(`Invalid artist id: ${id}`, HttpStatus.BAD_REQUEST);
    }

    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new HttpException(`Artist with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return artist;
  }
}

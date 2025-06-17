import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { ApiError } from 'exceptions/api.error';
import { FileService } from 'models/file/file.service';
import { Logger } from 'nestjs-pino';
import { TrackPublicService } from 'models/track/track.public';
import { AlbumType } from '@prisma/client';
import { ArtistPublicService } from 'models/artist/artist.public';
import { FileType } from 'models/file/types';
import { FeaturedArtistPublicService } from 'models/featuredArtist/featuredArtistPublic.service';
import { AlbumRepository } from './album.repository';

@Injectable()
export class AlbumService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
    private readonly artistPublicService: ArtistPublicService,
    private readonly trackPublicService: TrackPublicService,
    private readonly featuredPublicArtistService: FeaturedArtistPublicService,
    private readonly albumRepository: AlbumRepository,
    private readonly logger: Logger,
  ) {}

  async create(
    dto: CreateAlbumDto,
    pictureFile: Express.Multer.File | undefined,
    tracksFiles: Express.Multer.File[],
  ): Promise<string> {
    if (!pictureFile || !tracksFiles) {
      throw ApiError.BadRequest('Files not found');
    }

    let tracksPath: string[] = [];
    let imagePaths: string[] = [];
    let mainImagePath: string;

    const transaction = this.prisma.$transaction(
      async (prisma) => {
        try {
          tracksPath = await this.fileService.createFiles(FileType.AUDIO, tracksFiles);
          const imageResult = await this.fileService.createFile(FileType.IMAGE, pictureFile);
          if (typeof imageResult === 'object' && 'paths' in imageResult) {
            imagePaths = imageResult.paths;
            mainImagePath = imagePaths.find((p) => p.includes('-md.webp')) || imagePaths[0];
          } else {
            throw ApiError.InternalServerError('Expected paths array for image');
          }

          const albumType = this.determineAlbumType(dto);

          const artist = await this.artistPublicService.findOrCreateArtist(
            dto,
            mainImagePath,
            prisma,
          );
          const newAlbum = await this.albumRepository.create(
            dto,
            mainImagePath,
            artist.id,
            albumType,
            prisma,
          );
          const totalDuration = await this.trackPublicService.createMultiple(
            dto,
            tracksPath,
            mainImagePath,
            artist.id,
            newAlbum.id,
            prisma,
          );

          this.logger.debug('albumId', newAlbum.id);
          const formattedDuration = this.formatDuration(totalDuration);
          await this.albumRepository.update(newAlbum.id, { duration: formattedDuration }, prisma);

          if (dto.featArtists && dto.featArtists.length > 0) {
            for (const featArtistName of dto.featArtists) {
              await this.featuredPublicArtistService.findOrCreateArtist(
                { artist: featArtistName, genre: dto.genre },
                mainImagePath,
                newAlbum.id,
                prisma,
              );
            }
          }

          return { id: newAlbum.id, name: newAlbum.name };
        } catch (e) {
          this.fileService.cleanupFiles(tracksPath, mainImagePath);
          console.log(`Error creating album: ${e.message}`);
          throw ApiError.InternalServerError(`Error creating album: ${e.message}`, e);
        }
      },
      { timeout: 60000 },
    );

    return transaction
      .then((result) => JSON.stringify(result))
      .catch((e) => {
        throw ApiError.InternalServerError(`Transaction failed: ${e.message}`, e);
      });
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
      console.log('get All in service');
      const albums = await this.albumRepository.getAll({ page, count, sortBy });
      return albums;
    } catch (e) {
      this.logger.error('Error service', e);
      throw e;
    }
  }

  private determineAlbumType(dto: CreateAlbumDto): AlbumType {
    if (dto.type?.trim() !== '') {
      return dto.track_names.length > 1 ? 'ALBUM' : 'SINGLE';
    }
    return 'COLLECTION';
  }

  private formatDuration(totalDuration: number): string {
    const totalMinutes = Math.floor(totalDuration / 60);
    const totalSeconds = Math.round(totalDuration % 60);
    return `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
  }
}

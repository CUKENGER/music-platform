import { Injectable } from '@nestjs/common';
import { Album, Prisma } from '@prisma/client';
import { AlbumRepository } from './album.repository';

@Injectable()
export class AlbumPublicService {
  constructor(
    private readonly albumRepository: AlbumRepository
  ) {}

  async createSingleAlbum(
    dto: {
      genre: string;
      name: string;
      description: string;
      releaseDate: string;
    },
    picture: string,
    artistId: number,
    prisma: Prisma.TransactionClient,
  ): Promise<Album> {
    return await this.albumRepository.create(dto, picture, artistId, 'SINLGE', prisma);
  }

  async addListen(albumId: number, listens: number, prisma: Prisma.TransactionClient) {
    return await this.albumRepository.update(albumId, { listens }, prisma);
  }

  async deleteAlbum(albumId: number) {
    return await this.albumRepository.deleteAlbum(albumId);
  }
}

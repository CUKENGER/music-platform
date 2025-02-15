import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ArtistRepository } from './artist.repository';

@Injectable()
export class ArtistPublicService {
  constructor(
    private readonly artistRepository: ArtistRepository
  ) {}

  async findOrCreateArtist(
    dto: {
      artist: string;
      genre: string;
    },
    picture: string,
    prisma: Prisma.TransactionClient,
  ) {
    let artist = await this.artistRepository.findByName(dto.artist, prisma);

    if (!artist) {
      const artistDto = {
        // name: dto.artist,
        // genre: dto.genre,
        name: 'fdsfdsfhj',
        genre: 'dsfsdf',
        description: '',
      };
      artist = await this.artistRepository.create(artistDto, picture, prisma);
    }
    return artist;
  }

  async addListen(artistId: number,listens: number, prisma: Prisma.TransactionClient) {
    return await prisma.album.update({
      where: { id: artistId },
      data: { listens: listens },
    });
  }
}

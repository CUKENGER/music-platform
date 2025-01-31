import { Injectable } from '@nestjs/common';
import { FeaturedArtist, Prisma } from '@prisma/client';
import { ArtistPublicService } from 'models/artist/artist.public';
import { FeaturedArtistRepository } from './featuredArtist.repository';

@Injectable()
export class FeaturedArtistService {
  constructor(
    private readonly artistPublicService: ArtistPublicService,
    private featuredArtistRepository: FeaturedArtistRepository,
  ) {}

  async findOrCreateArtist(
    dto: {
      artist: string;
      genre: string;
    },
    imagePath: string,
    albumId: number,
    prisma: Prisma.TransactionClient,
  ): Promise<FeaturedArtist> {
    const artist = await this.artistPublicService.findOrCreateArtist(
      { artist: dto.artist, genre: dto.genre },
      imagePath,
      prisma,
    );
    return await this.featuredArtistRepository.create(artist.id, prisma, albumId);
  }
}

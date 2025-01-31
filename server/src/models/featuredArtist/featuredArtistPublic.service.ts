import { Injectable } from '@nestjs/common';
import { Prisma, FeaturedArtist } from '@prisma/client';
import { ArtistPublicService } from 'models/artist/artist.public';

@Injectable()
export class FeaturedArtistPublicService {
  constructor(
    private artistPublicService: ArtistPublicService,
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
    return await prisma.featuredArtist.create({
      data: {
        artistId: artist.id,
        albumId: albumId,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { FeaturedArtist, Prisma } from '@prisma/client';

@Injectable()
export class FeaturedArtistRepository {
  constructor() {}

  async create(
    artistId: number,
    prisma: Prisma.TransactionClient,
    albumId?: number,
  ): Promise<FeaturedArtist> {
    return await prisma.featuredArtist.create({
      data: {
        artistId: artistId,
        albumId: albumId,
      },
    });
  }

  async find(id: number, prisma: Prisma.TransactionClient) {
    return await prisma.featuredArtist.findFirst({
      where: { id },
    })
  }
}

import { Prisma } from '@prisma/client';

export type ArtistWithPopularTracks = Prisma.ArtistGetPayload<{
  include: {
    tracks: {
      take: 5;
      orderBy: {
        listens: 'desc';
      };
      include: {
        artist: true;
        likedByUsers: true;
        listenedByUsers: true;
      };
    };
    albums: {
      include: {
        tracks: true;
      };
    };
  };
}>;

export type ArtistWithAllPopularTracks = Prisma.ArtistGetPayload<{
  include: {
    tracks: {
      orderBy: {
        listens: 'desc';
      };
      include: {
        artist: true;
        likedByUsers: true;
        listenedByUsers: true;
      };
    };
  };
}>;

import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumPublicService } from './album.public';
import { AlbumService } from './album.service';
import { FeaturedArtistModule } from 'models/featuredArtist/featuredArtist.module';
import { TrackModule } from 'models/track/track.module';
import { AlbumRepository } from './album.repository';
import { FileModule } from 'models/file/file.module';
import { ArtistModule } from 'models/artist/artist.module';

@Module({
  imports: [
    FeaturedArtistModule,
    TrackModule,
    FileModule,
    ArtistModule
  ],
  controllers: [AlbumController],
  providers: [
    AlbumService,
    AlbumRepository,
    AlbumPublicService,
  ],
  exports: [AlbumPublicService],
})
export class AlbumModule {}

import { forwardRef, Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { FileModule } from 'models/file/file.module';
import { TrackHelperService } from './trackHelper.service';
import { TrackPublicService } from './track.public';
import { ArtistModule } from 'models/artist/artist.module';
import { CommentModule } from 'models/comment/comment.module';
import { TrackRepository } from './track.repository';
import { AudioModule } from 'models/audio/audio.module';
import { AlbumModule } from 'models/album/album.module';
import { FeaturedArtistModule } from 'models/featuredArtist/featuredArtist.module';
import { UserModule } from 'models/user/user.module';

@Module({
  imports: [
    FileModule, 
    forwardRef(() => ArtistModule), 
    CommentModule,
    AudioModule,
    forwardRef(() => AlbumModule),
    FeaturedArtistModule,
    UserModule,
  ],
  controllers: [TrackController],
  providers: [
    TrackService,
    TrackHelperService,
    TrackPublicService,
    TrackRepository
  ],
  exports: [TrackPublicService],
})
export class TrackModule {}

import { Module } from '@nestjs/common';
import { Track } from './track/scheme/track.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Comment} from './track/scheme/comment.schema';
import { TrackModule } from './track/track.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { MulterModule } from '@nestjs/platform-express/multer';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..','static'),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db/music.db',
      entities: [Track, Comment],
      synchronize: true,
    }),
    MulterModule.register({
      dest: './upload', // Папка, куда будут сохраняться загруженные файлы
      limits: {
        fileSize: Infinity, // Максимальный размер файла (в байтах). Например, здесь установлен лимит в 10 МБ
        fieldSize: 10000 * 1024 * 1024,
      }
    }),
    TrackModule,
    FileModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

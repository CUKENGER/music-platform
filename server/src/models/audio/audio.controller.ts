import { Controller, Get, Param, Res, Req, HttpStatus, BadRequestException } from '@nestjs/common';
import { Response, Request } from 'express';
import { Logger } from 'nestjs-pino';
import { AudioService } from './audio.service';
import * as crypto from 'crypto';

@Controller('audio')
export class AudioController {
  constructor(
    private readonly audioService: AudioService,
    private readonly logger: Logger,
  ) {}

  @Get(':filename/full')
  async getFullAudio(
    @Param('filename') filename: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    this.logger.log(`Requested full audio file: ${filename}`);

    try {
      const fileMetadata = await this.audioService.getFileMetadata(filename);
      if (!fileMetadata) {
        return res.status(HttpStatus.NOT_FOUND).send('Audio file not found');
      }

      // Генерируем ETag на основе имени файла и размера
      const eTag = `"${crypto.createHash('md5').update(`${filename}-${fileMetadata.fileSize}`).digest('hex')}"`;
      if (req.headers['if-none-match'] === eTag) {
        return res.status(HttpStatus.NOT_MODIFIED).end();
      }

      res.set({
        'Content-Length': fileMetadata.fileSize.toString(),
        'Content-Type': 'audio/mpeg',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400', // Кэш на 24 часа
        ETag: eTag,
      });

      res.status(HttpStatus.OK);

      const fileStream = this.audioService.createFileStream(
        fileMetadata.filePath,
        0,
        fileMetadata.fileSize - 1,
      );
      fileStream.pipe(res);

      this.logger.log(
        `Streaming full audio file: ${filename} (size: ${fileMetadata.fileSize} bytes)`,
      );
    } catch (e) {
      this.logger.error(`Error streaming full audio file: ${e.message}`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error streaming audio file');
    }
  }

  @Get(':filename')
  async streamAudio(
    @Param('filename') filename: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    this.logger.log('Requested filename:', filename);

    try {
      const fileMetadata = await this.audioService.getFileMetadata(filename);
      if (!fileMetadata) {
        return res.status(HttpStatus.NOT_FOUND).send('Audio file not found');
      }
      const range = req.headers.range;
      if (!range) {
        throw new BadRequestException('Range header required');
      }

      const { start, end, chunkSize } = this.audioService.calculateRange(
        range,
        fileMetadata.fileSize,
      );

      const bitrate = await this.audioService.getAudioBitrate(fileMetadata.filePath);
      const chunkDurationSeconds = this.audioService.calculateChunkDuration(chunkSize, bitrate);

      // Генерируем ETag для чанка
      const eTag = `"${crypto.createHash('md5').update(`${filename}-${start}-${end}`).digest('hex')}"`;
      if (req.headers['if-none-match'] === eTag) {
        return res.status(HttpStatus.NOT_MODIFIED).end();
      }

      res.set({
        'Content-Range': `bytes ${start}-${end}/${fileMetadata.fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize.toString(),
        'Content-Type': filename.endsWith('.m4a') ? 'audio/mp4' : 'audio/mpeg',
        'X-Chunk-Duration': chunkDurationSeconds.toString(),
        'Cache-Control': 'public, max-age=86400', // Кэш на 24 часа
        ETag: eTag,
        'Access-Control-Allow-Origin': '*',
      });

      res.status(HttpStatus.PARTIAL_CONTENT);

      const fileStream = this.audioService.createFileStream(fileMetadata.filePath, start, end);
      fileStream.pipe(res);

      this.logger.log(`Streaming chunk from ${start} to ${end} (size: ${chunkSize} bytes)`);
    } catch (e) {
      this.logger.error(`Error streaming audio: ${e.message}`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error streaming audio');
    }
  }

  @Get(':filename/:segment')
  async getHlsSegment(
    @Param('filename') filename: string,
    @Param('segment') segment: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    this.logger.log(`Requested HLS segment ${segment} for ${filename}`);
    try {
      const segmentPath = await this.audioService.getHlsSegmentPath(filename, segment);
      // Генерируем ETag на основе имени сегмента
      const eTag = `"${crypto.createHash('md5').update(`${filename}-${segment}`).digest('hex')}"`;
      if (req.headers['if-none-match'] === eTag) {
        return res.status(HttpStatus.NOT_MODIFIED).end();
      }

      res.set({
        'Content-Type': 'video/mp2t',
        'Cache-Control': 'public, max-age=86400', // Кэш на 24 часа
        ETag: eTag,
        'Access-Control-Allow-Origin': '*',
      });

      res.sendFile(segmentPath);
    } catch (e) {
      this.logger.error(`Error serving HLS segment: ${e.message}`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error serving HLS segment');
    }
  }

  @Get(':filename/master.m3u8')
  async getMasterHlsPlaylist(
    @Param('filename') filename: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    this.logger.log(`Requested HLS master playlist for ${filename}`);
    try {
      const playlistPath = await this.audioService.getHlsPlaylistPath(filename);

      // Генерируем ETag на основе имени плейлиста
      const eTag = `"${crypto.createHash('md5').update(`${filename}-master.m3u8`).digest('hex')}"`;
      if (req.headers['if-none-match'] === eTag) {
        return res.status(HttpStatus.NOT_MODIFIED).end();
      }

      res.set({
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Cache-Control': 'no-cache', // Проверяем актуальность
        ETag: eTag,
        'Access-Control-Allow-Origin': '*',
      });

      res.sendFile(playlistPath);
    } catch (e) {
      this.logger.error(`Error serving HLS master playlist: ${e.message}`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error serving HLS master playlist');
    }
  }

  @Get(':filename/:playlist')
  async getHlsPlaylist(
    @Param('filename') filename: string,
    @Param('playlist') playlist: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    this.logger.log(`Requested HLS playlist ${playlist} for ${filename}`);
    try {
      const playlistPath = await this.audioService.getHlsSubPlaylistPath(filename, playlist);
      // Генерируем ETag на основе имени плейлиста
      const eTag = `"${crypto.createHash('md5').update(`${filename}-${playlist}`).digest('hex')}"`;
      if (req.headers['if-none-match'] === eTag) {
        return res.status(HttpStatus.NOT_MODIFIED).end();
      }

      res.set({
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Cache-Control': 'no-cache', // Проверяем актуальность
        ETag: eTag,
        'Access-Control-Allow-Origin': '*',
      });
      res.sendFile(playlistPath);
    } catch (e) {
      this.logger.error(`Error serving HLS playlist: ${e.message}`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error serving HLS playlist');
    }
  }
}

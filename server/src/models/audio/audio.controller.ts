import { Controller, Get, Param, Res, Req, HttpStatus, BadRequestException } from '@nestjs/common';
import { Response, Request } from 'express';
import { Logger } from 'nestjs-pino';
import { AudioService } from './audio.service';

@Controller('audio')
export class AudioController {
  constructor(
    private readonly audioService: AudioService,
    private readonly logger: Logger,
  ) {}

  @Get(':filename/full')
  async getFullAudio(@Param('filename') filename: string, @Res() res: Response) {
    this.logger.log(`Requested full audio file: ${filename}`);

    try {
      const fileMetadata = await this.audioService.getFileMetadata(filename);
      if (!fileMetadata) {
        return res.status(HttpStatus.NOT_FOUND).send('Audio file not found');
      }

      // Настраиваем заголовки ответа
      res.set({
        'Content-Length': fileMetadata.fileSize.toString(),
        'Content-Type': 'audio/mpeg',
        'Accept-Ranges': 'bytes',
      });

      // Устанавливаем статус 200 OK
      res.status(HttpStatus.OK);

      // Стримим весь файл
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

      // Обрабатываем заголовок Range
      const range = req.headers.range;
      if (!range) {
        throw new BadRequestException('Range header required');
      }

      // Получаем диапазон для стриминга
      const { start, end, chunkSize } = this.audioService.calculateRange(
        range,
        fileMetadata.fileSize,
      );

      // Получаем битрейт и длительность чанка
      const bitrate = await this.audioService.getAudioBitrate(fileMetadata.filePath);
      const chunkDurationSeconds = this.audioService.calculateChunkDuration(chunkSize, bitrate);

      // Настраиваем заголовки ответа
      res.set({
        'Content-Range': `bytes ${start}-${end}/${fileMetadata.fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': filename.endsWith('.m4a') ? 'audio/mp4' : 'audio/mpeg',
        'X-Chunk-Duration': chunkDurationSeconds.toString(),
      });

      // Устанавливаем статус 206 Partial Content
      res.status(HttpStatus.PARTIAL_CONTENT);

      // Стримим файл
      const fileStream = this.audioService.createFileStream(fileMetadata.filePath, start, end);
      fileStream.pipe(res);

      // Логируем успешное выполнение
      this.logger.log(`Streaming chunk from ${start} to ${end} (size: ${chunkSize} bytes)`);
    } catch (e) {
      this.logger.error(`Error streaming audio: ${e.message}`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error streaming audio');
    }
  }

  @Get(':filename/playlist.m3u8')
  async getHlsPlaylist(@Param('filename') filename: string, @Res() res: Response) {
    this.logger.log(`Requested HLS playlist for ${filename}`);
    try {
      const playlistPath = await this.audioService.getHlsPlaylistPath(filename);
      res.set({
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Access-Control-Allow-Origin': '*', // Настройте CORS по необходимости
      });
      res.sendFile(playlistPath);
    } catch (e) {
      this.logger.error(`Error serving HLS playlist: ${e.message}`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error serving HLS playlist');
    }
  }

  // Новый эндпоинт для HLS-сегментов
  @Get(':filename/:segment')
  async getHlsSegment(
    @Param('filename') filename: string,
    @Param('segment') segment: string,
    @Res() res: Response,
  ) {
    this.logger.log(`Requested HLS segment ${segment} for ${filename}`);
    try {
      const segmentPath = await this.audioService.getHlsSegmentPath(filename, segment);
      res.set({
        'Content-Type': 'video/mp2t', // Для .ts сегментов
        'Access-Control-Allow-Origin': '*', // Настройте CORS по необходимости
      });
      res.sendFile(segmentPath);
    } catch (e) {
      this.logger.error(`Error serving HLS segment: ${e.message}`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error serving HLS segment');
    }
  }
}

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
        'Content-Type': 'audio/mpeg',
        'X-Chunk-Duration': chunkDurationSeconds.toString(),
      });

      // Устанавливаем статус 206 Partial Content
      res.status(HttpStatus.PARTIAL_CONTENT);

      // Стримим файл
      const fileStream = this.audioService.createFileStream(fileMetadata.filePath, start, end);
      fileStream.pipe(res);

      // Логируем успешное выполнение
      this.logger.log(`Streaming chunk from ${start} to ${end} (size: ${chunkSize} bytes)`);
    } catch (e) {}

    // const fileSize = stat.size;
    //
    // // Проверка на наличие заголовка Range
    // const range = req.headers.range;
    // if (!range) {
    //   throw new BadRequestException('Range header required');
    // }
    // this.logger.log('Range header:', req.headers.range);
    //
    // // Парсинг диапазона
    // const parts = range.replace(/bytes=/, '').split('-');
    // const start = parseInt(parts[0], 10);
    // this.logger.log('start', start);
    // let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    // this.logger.log('end', end);
    //
    // if (start >= fileSize || end >= fileSize) {
    //   res.status(416).send('Requested range not satisfiable');
    //   return;
    // }
    //
    // if (end > fileSize - 1) {
    //   end = fileSize - 1;
    // }
    //
    // // Проверка на корректность диапазона
    // if (start >= fileSize || end >= fileSize || start >= end) {
    //   return res
    //     .status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
    //     .set({
    //       'Content-Range': `bytes */${fileSize}`,
    //     })
    //     .end();
    // }
    //
    // const chunkSize = end - start + 1;
    // this.logger.log(`Streaming chunk from ${start} to ${end} (size: ${chunkSize} bytes)`);
    //
    // const bitrate = await this.audioService.getAudioBitrate(filePath);
    // const chunkDurationSeconds = chunkSize / (bitrate / 8);
    // const chunkDurationInteger = Math.floor(chunkDurationSeconds);
    // this.logger.log('chunkDurationSeconds', chunkDurationInteger);
    //
    // // Потоковое чтение файла
    // const fileStream = fs.createReadStream(filePath, { start, end });
    //
    // // Отправка заголовков
    // res.set({
    //   'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    //   'Accept-Ranges': 'bytes',
    //   'Content-Length': chunkSize,
    //   'Content-Type': 'audio/mpeg',
    //   'X-Chunk-Duration': chunkDurationInteger.toString(),
    // });
    // this.logger.log('Sent X-Chunk-Duration:', chunkDurationInteger.toString());
    //
    // // Установка статуса 206 Partial Content
    // res.status(HttpStatus.PARTIAL_CONTENT);
    //
    // // Обработка ошибок потока
    // fileStream.on('error', (err) => {
    //   this.logger.error('Error streaming audio file:', err);
    //   res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error streaming audio file');
    // });
    //
    // // Отправка данных через поток
    // fileStream.pipe(res);
  }
}

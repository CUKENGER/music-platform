import { Controller, Get, Param, Res, Req, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import * as fs from 'fs';
import { AudioService } from 'models/audioService/audioService.service';
import * as path from 'path';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Get(':filename')
  async streamAudio(
    @Param('filename') filename: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    console.log('Requested filename:', filename);

    // Безопасное построение пути
    const filePath = path.resolve(
      __dirname,
      '../../../../',
      'server/static/audio',
      path.basename(filename),
    );
    console.log('Resolved filePath:', filePath);

    // Проверка существования файла
    if (!fs.existsSync(filePath)) {
      return res.status(HttpStatus.NOT_FOUND).send('Audio file not found');
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    // Проверка на наличие заголовка Range
    const range = req.headers.range;
    if (!range) {
      return res.status(HttpStatus.BAD_REQUEST).send('Range header required');
    }
    console.log('Range header:', req.headers.range);

    // Парсинг диапазона
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    console.log('start', start);
    let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    console.log('end', end);

    if (start >= fileSize || end >= fileSize) {
      res.status(416).send('Requested range not satisfiable');
      return;
    }

    if (end > fileSize - 1) {
      end = fileSize - 1;
    }

    // Проверка на корректность диапазона
    if (start >= fileSize || end >= fileSize || start >= end) {
      return res
        .status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
        .set({
          'Content-Range': `bytes */${fileSize}`,
        })
        .end();
    }

    const chunkSize = end - start + 1;
    console.log(`Streaming chunk from ${start} to ${end} (size: ${chunkSize} bytes)`);

    const bitrate = await this.audioService.getAudioBitrate(filePath);
    const chunkDurationSeconds = chunkSize / (bitrate / 8);
    const chunkDurationInteger = Math.floor(chunkDurationSeconds);
    console.log('chunkDurationSeconds', chunkDurationInteger);

    // Потоковое чтение файла
    const fileStream = fs.createReadStream(filePath, { start, end });

    // Отправка заголовков
    res.set({
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'audio/mpeg',
      'X-Chunk-Duration': chunkDurationInteger.toString(),
    });
    console.log('Sent X-Chunk-Duration:', chunkDurationInteger.toString());

    // Установка статуса 206 Partial Content
    res.status(HttpStatus.PARTIAL_CONTENT);

    // Обработка ошибок потока
    fileStream.on('error', (err) => {
      console.error('Error streaming audio file:', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error streaming audio file');
    });

    // Отправка данных через поток
    fileStream.pipe(res);
  }
}

import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as ffprobeStatic from 'ffprobe-static';
import * as path from 'path';
import * as fs from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';
import { Logger } from 'nestjs-pino';
import { STATIC_FILES_PATH } from 'constants/paths';

@Injectable()
export class AudioService {
  constructor(private readonly logger: Logger) {}

  async getAudioDuration(filePath: string): Promise<string> {
    this.logger.log(`filePath getAudioDuration: ${filePath}`);
    const dp = this.resolveFilePath(filePath);

    if (!fs.existsSync(dp)) {
      throw new NotFoundException(`File does not exist: ${filePath}`);
    }

    try {
      const duration = await this.getAudioDurationFromFile(dp);
      const minutes = Math.floor(duration / 60);
      const seconds = Math.round(duration % 60);
      const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

      return formattedDuration;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to process the audio file: ${error.message}`);
    }
  }

  async getAudioDurationInNum(filePath: string): Promise<number> {
    const dp = this.resolveFilePath(filePath);

    if (!fs.existsSync(dp)) {
      throw new NotFoundException(`File does not exist: ${filePath}`);
    }

    try {
      return await this.getAudioDurationFromFile(dp);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to process the audio file: ${error.message}`);
    }
  }

  async getAudioBitrate(filePath: string): Promise<number> {
    const dp = this.resolveFilePath(filePath);

    if (!fs.existsSync(dp)) {
      throw new NotFoundException(`File does not exist: ${filePath}`);
    }

    return new Promise<number>((resolve, reject) => {
      ffmpeg.setFfprobePath(ffprobeStatic.path);
      ffmpeg.ffprobe(dp, (err, metadata) => {
        if (err) {
          reject(new InternalServerErrorException(`Error retrieving bitrate: ${err.message}`));
        } else {
          const bitrate = metadata.format.bit_rate;
          if (bitrate === undefined) {
            reject(new InternalServerErrorException('Bitrate is undefined'));
          } else {
            // Если bitrate — строка, преобразуем её в число
            if (typeof bitrate === 'string') {
              resolve(parseInt(bitrate, 10));
            } else if (typeof bitrate === 'number') {
              // Если bitrate уже число, просто возвращаем его
              resolve(bitrate);
            } else {
              // Обработка неожиданного типа
              reject(new InternalServerErrorException('Bitrate is of an unexpected type'));
            }
          }
          // if (bitrate === undefined) {
          //   reject(new InternalServerErrorException('Bitrate is undefined'));
          // } else {
          //   if (bitrate) {
          //     resolve(parseInt(bitrate, 10));
          //   }
          // }

          // resolve(parseInt(bitrate, 10));
        }
      });
    });
  }

  async getFileMetadata(filename: string): Promise<{ filePath: string; fileSize: number } | null> {
    const filePath = path.resolve(STATIC_FILES_PATH, 'audio', path.basename(filename));
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const stat = fs.statSync(filePath);
    return { filePath, fileSize: stat.size };
  }

  calculateRange(
    rangeHeader: string,
    fileSize: number,
  ): { start: number; end: number; chunkSize: number } {
    const parts = rangeHeader.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize || start >= end) {
      throw new Error('Requested range not satisfiable');
    }

    if (end > fileSize - 1) {
      end = fileSize - 1;
    }

    const chunkSize = end - start + 1;
    return { start, end, chunkSize };
  }

  calculateChunkDuration(chunkSize: number, bitrate: number): number {
    return Math.floor(chunkSize / (bitrate / 8));
  }

  createFileStream(filePath: string, start: number, end: number): fs.ReadStream {
    return fs.createReadStream(filePath, { start, end });
  }

  private async getAudioDurationFromFile(dp: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      ffmpeg.setFfprobePath(ffprobeStatic.path);
      ffmpeg.ffprobe(dp, (err, metadata) => {
        if (err) {
          reject(
            new InternalServerErrorException(`Error retrieving file metadata: ${err.message}`),
          );
        } else {
          if (metadata.format.duration === undefined) {
            reject(new InternalServerErrorException('Duration is undefined'));
          } else {
            resolve(metadata.format.duration);
          }
          // resolve(metadata.format.duration);
        }
      });
    });
  }

  private resolveFilePath(filePath: string): string {
    return path.resolve(STATIC_FILES_PATH, filePath);
  }
}

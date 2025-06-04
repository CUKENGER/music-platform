import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AudioService {
  constructor(private readonly logger: Logger) {
    this.logger.log('FFmpeg paths initialized:', {
      ffmpegPath: 'ffmpeg',
      ffprobePath: 'ffprobe',
    });
  }

  async generateHlsSegments(filename: string): Promise<{ playlistPath: string }> {
    const cleanFilename = filename.startsWith('audio/') ? filename.replace('audio/', '') : filename;
    const segmentDir = this.resolveFilePath(`hls/${cleanFilename}`);
    const playlistPath = path.join(segmentDir, 'playlist.m3u8');

    if (fs.existsSync(playlistPath)) {
      this.logger.log(`Using cached HLS segments for ${filename}`);
      return { playlistPath };
    }

    await fs.promises.mkdir(segmentDir, { recursive: true });

    const inputPath = this.resolveFilePath(`audio/${cleanFilename}`);
    if (!fs.existsSync(inputPath)) {
      throw new NotFoundException(`Audio file not found: ${filename}`);
    }

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .inputFormat(cleanFilename.endsWith('.m4a') ? 'mp4' : path.extname(cleanFilename).slice(1))
        .outputOptions([
          '-hls_time 4',
          '-hls_list_size 0',
          '-hls_segment_type mpegts',
          '-hls_segment_filename',
          `${segmentDir}/%03d.ts`,
          '-f hls',
          '-loglevel verbose',
        ])
        .output(playlistPath)
        .on('end', () => {
          this.logger.log(`HLS segments generated for ${filename}`);
          resolve();
        })
        .on('error', (err) => {
          this.logger.error(`Error generating HLS segments: ${err.message}`);
          reject(
            new InternalServerErrorException(`Failed to generate HLS segments: ${err.message}`),
          );
        })
        .run();
    });

    return { playlistPath };
  }

  async getFileMetadata(filename: string): Promise<{ filePath: string; fileSize: number } | null> {
    const cleanFilename = filename.startsWith('audio/') ? filename.replace('audio/', '') : filename;
    const filePath = this.resolveFilePath(`audio/${cleanFilename}`);
    this.logger.log('Checking file existence:', { filePath });
    if (!fs.existsSync(filePath)) {
      this.logger.error('File not found:', { filePath });
      return null;
    }
    const stat = fs.statSync(filePath);
    return { filePath, fileSize: stat.size };
  }

  async getAudioBitrate(filePath: string): Promise<number> {
    const dp = this.resolveFilePath(filePath);
    if (!fs.existsSync(dp)) {
      throw new NotFoundException(`File does not exist: ${filePath}`);
    }

    return new Promise<number>((resolve, reject) => {
      ffmpeg.setFfprobePath('ffprobe');
      ffmpeg.ffprobe(dp, (err, metadata) => {
        if (err) {
          reject(new InternalServerErrorException(`Error retrieving bitrate: ${err.message}`));
        } else {
          const bitrate = metadata.format.bit_rate;
          if (bitrate === undefined) {
            reject(new InternalServerErrorException('Bitrate is undefined'));
          } else if (typeof bitrate === 'string') {
            resolve(parseInt(bitrate, 10));
          } else if (typeof bitrate === 'number') {
            resolve(bitrate);
          } else {
            reject(new InternalServerErrorException('Bitrate is of an unexpected type'));
          }
        }
      });
    });
  }

  async getAudioDuration(filePath: string): Promise<string> {
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

  async getHlsPlaylistPath(filename: string): Promise<string> {
    const { playlistPath } = await this.generateHlsSegments(filename);
    if (!fs.existsSync(playlistPath)) {
      throw new NotFoundException(`HLS playlist not found: ${filename}`);
    }
    return playlistPath;
  }

  async getHlsSegmentPath(filename: string, segment: string): Promise<string> {
    const cleanFilename = filename.startsWith('audio/') ? filename.replace('audio/', '') : filename;
    this.logger.log('cleanFilename', cleanFilename);
    const segmentDir = this.resolveFilePath(`hls/${cleanFilename}`);
    this.logger.log('segmentDir', segmentDir);
    const segmentPath = path.join(segmentDir, segment);
    this.logger.log('segmentPath', segmentPath);
    this.logger.log('Проверяю путь к сегменту:', {
      segmentPath,
      exists: fs.existsSync(segmentPath),
    });
    if (!fs.existsSync(segmentPath)) {
      this.logger.error('Сегмент не найден:', { segmentPath });
      throw new NotFoundException(`HLS сегмент не найден: ${segment}`);
    }
    return segmentPath;
  }

  async cleanupHlsSegments(filename: string): Promise<void> {
    const cleanFilename = filename.startsWith('audio/') ? filename.replace('audio/', '') : filename;
    const segmentDir = this.resolveFilePath(`hls/${cleanFilename}`);
    if (fs.existsSync(segmentDir)) {
      await fs.promises.rm(segmentDir, { recursive: true, force: true });
      this.logger.log(`HLS segments cleaned up for ${filename}`);
    }
  }

  calculateRange(
    rangeHeader: string,
    fileSize: number,
  ): { start: number; end: number; chunkSize: number } {
    const parts = rangeHeader.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize || start > end) {
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

  private durationCache = new Map<string, number>();

  private async getAudioDurationFromFile(dp: string): Promise<number> {
    if (this.durationCache.has(dp)) {
      return this.durationCache.get(dp)!;
    }
    return new Promise<number>((resolve, reject) => {
      ffmpeg.setFfprobePath('ffprobe');
      ffmpeg.ffprobe(dp, (err, metadata) => {
        if (err) {
          reject(
            new InternalServerErrorException(`Error retrieving file metadata: ${err.message}`),
          );
        } else if (metadata.format.duration === undefined) {
          reject(new InternalServerErrorException('Duration is undefined'));
        } else {
          this.durationCache.set(dp, metadata.format.duration);
          resolve(metadata.format.duration);
        }
      });
    });
  }

  private resolveFilePath(filePath: string): string {
    const resolvedPath = path.resolve(__dirname, '../../../static', filePath);
    this.logger.log('Resolved file path:', { resolvedPath });
    return resolvedPath;
  }
}

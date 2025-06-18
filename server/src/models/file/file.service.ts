import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as sharp from 'sharp';
import * as ffmpeg from 'fluent-ffmpeg';
import { Logger } from 'nestjs-pino';
import { ApiError } from 'exceptions/api.error';
import { FileType } from './types';
import { PassThrough } from 'stream';
import { Vibrant } from 'node-vibrant/node';

interface FileBodyType {
  originalname: string;
  buffer: Buffer;
}

@Injectable()
export class FileService {
  private readonly basePath = path.resolve(__dirname, '../../../static');
  private readonly imageSizes = [
    { size: 100, suffix: 'sm' },
    { size: 300, suffix: 'md' },
    { size: 600, suffix: 'lg' },
    { size: 200, suffix: 'sm-2x' },
    { size: 600, suffix: 'md-2x' },
  ];

  constructor(private readonly logger: Logger) {}

  async createFile(
    type: FileType,
    file: Express.Multer.File,
  ): Promise<string | { paths: string[]; coverColor: string }> {
    try {
      file = Array.isArray(file) ? file[0] : file;
      this.logger.log('Creating file', { originalname: file.originalname });

      if (!file || !file.originalname) {
        throw ApiError.BadRequest('File or originalname is missing');
      }

      if (type === FileType.IMAGE) {
        return await this.createImageFiles(file);
      } else if (type === FileType.AUDIO) {
        return await this.createAudioFile(file);
      } else {
        throw ApiError.BadRequest('Unsupported file type');
      }
    } catch (e) {
      this.logger.error(`Error creating file: ${file.originalname}, ${e.message}`);
      throw ApiError.InternalServerError('Failed to create file', e);
    }
  }

  private async createImageFiles(
    file: Express.Multer.File,
  ): Promise<{ paths: string[]; coverColor: string }> {
    const paths: string[] = [];
    const baseFileName = uuid.v4();

    let coverColor = '#000000';
    try {
      const palette = await Vibrant.from(file.buffer).getPalette();
      coverColor = palette.Vibrant?.hex || '#000000'; // Используем Vibrant или fallback
      this.logger.log('Extracted cover color', { coverColor });
    } catch (e) {
      this.logger.error(`Error extracting cover color: ${e.message}`);
    }

    for (const { size, suffix } of this.imageSizes) {
      const fileName = `${baseFileName}-${suffix}.webp`;
      const filePath = this.getFilePath(FileType.IMAGE, fileName);

      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

      await sharp(file.buffer)
        .resize(size, size, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 90, effort: 4 })
        .toFile(filePath);

      this.logger.log('Created image', { fileName, size });
      paths.push(`image/${fileName}`);
    }

    return { paths, coverColor };
  }

  private async createAudioFile(file: Express.Multer.File): Promise<string> {
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    const isConvertible = ['mp3', 'flac'].includes(fileExtension ?? 'null');
    const outputExtension = isConvertible ? 'm4a' : fileExtension;
    const fileName = `${uuid.v4()}.${outputExtension}`;
    const filePath = this.getFilePath(FileType.AUDIO, fileName);
    const cleanFilename = fileName;
    const segmentDir = this.getFilePath(FileType.HLS, cleanFilename);
    const masterPlaylistPath = path.join(segmentDir, 'master.m3u8');
    const highQualityPlaylist = path.join(segmentDir, 'high.m3u8');

    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.mkdir(segmentDir, { recursive: true });

    if (isConvertible) {
      const inputStream = new PassThrough();
      inputStream.end(file.buffer);

      // Шаг 1: Создаём .m4a файл
      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputStream)
          .inputFormat(fileExtension ?? 'null')
          .audioCodec('aac')
          .audioBitrate(256)
          .outputOptions(['-map 0:a', '-f mp4'])
          .on('stderr', (stderrLine) => {
            this.logger.log(`FFmpeg stderr (m4a): ${stderrLine}`);
          })
          .on('end', () => {
            this.logger.log(`Created .m4a file`, { fileName });
            resolve();
          })
          .on('error', (err) => {
            this.logger.error(`Error creating .m4a: ${err.message}`);
            reject(err);
          })
          .save(filePath);
      });

      await new Promise<void>((resolve, reject) => {
        ffmpeg(filePath)
          .inputFormat('mp4')
          .output(highQualityPlaylist)
          .outputOptions([
            '-map 0:a',
            '-c:a aac',
            '-b:a 256k',
            '-hls_time 6',
            '-hls_list_size 0',
            '-hls_segment_type mpegts',
            '-hls_segment_filename',
            `${segmentDir}/high_%03d.ts`,
            '-hls_playlist_type vod',
            '-master_pl_name master.m3u8',
          ])
          .on('stderr', (stderrLine) => {
            this.logger.log(`FFmpeg stderr (HLS): ${stderrLine}`);
          })
          .on('end', () => {
            this.logger.log(`HLS segments generated`, { fileName });
            // Создаём мастер-плейлист
            const masterPlaylistContent = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=256000,CODECS="mp4a.40.2"
high.m3u8`;
            fs.writeFileSync(masterPlaylistPath, masterPlaylistContent);
            this.logger.log(`Master playlist created`, { fileName });
            ffmpeg.ffprobe(filePath, (err, metadata) => {
              if (!err) {
                this.logger.log(`File metrics`, {
                  fileName,
                  bitrate: metadata.format.bit_rate,
                  duration: metadata.format.duration,
                });
              }
            });
            fs.readdir(segmentDir, (err, files) => {
              if (!err) {
                const highTsFiles = files.filter(
                  (f) => f.startsWith('high_') && f.endsWith('.ts'),
                ).length;
                this.logger.log(`Generated ${highTsFiles} high-quality HLS segments`, { fileName });
                // Проверка размера сегментов
                files
                  .filter((f) => f.endsWith('.ts'))
                  .forEach((file) => {
                    const filePath = path.join(segmentDir, file);
                    const stats = fs.statSync(filePath);
                    this.logger.log(`Segment ${file} size: ${stats.size / 1024} KB`);
                  });
              }
            });
            resolve();
          })
          .on('error', (err) => {
            this.logger.error(`Error generating HLS: ${err.message}`);
            reject(err);
          })
          .run();
      });
    } else {
      await fs.promises.writeFile(filePath, file.buffer);
    }

    this.logger.log('Created audio file', { fileName });
    return `audio/${fileName}`;
  }

  async createFiles(type: FileType, files: FileBodyType[]): Promise<string[]> {
    const filePaths: string[] = [];
    const filePath = this.getFilePath(type, '');

    await fs.promises.mkdir(filePath, { recursive: true });

    for (const file of files) {
      try {
        if (!file || !file.originalname) {
          throw ApiError.BadRequest('File or originalname is missing');
        }

        const result = await this.createFile(type, {
          originalname: file.originalname,
          buffer: file.buffer,
        } as Express.Multer.File);

        if (typeof result === 'string') {
          filePaths.push(result);
        } else if (result.paths) {
          filePaths.push(...result.paths);
        }
      } catch (e) {
        this.logger.error(`Error creating files: ${file.originalname}, ${e.message}`);
        throw ApiError.InternalServerError('Failed to create files');
      }
    }
    return filePaths;
  }

  cleanupFiles(tracksPaths: string[], coverPath?: string): void {
    try {
      if (coverPath) {
        const fullCoverPath = this.getFilePath(FileType.IMAGE, coverPath);
        if (fs.existsSync(fullCoverPath)) {
          fs.unlinkSync(fullCoverPath);
        }
      }

      tracksPaths.forEach((trackPath) => {
        const fullTrackPath = this.getFilePath(FileType.AUDIO, trackPath);
        if (fs.existsSync(fullTrackPath)) {
          fs.unlinkSync(fullTrackPath);
        }
      });
    } catch (error) {
      this.logger.error(`Error cleaning up files: ${error.message}`);
      throw ApiError.InternalServerError('Failed to clean up files');
    }
  }

  cleanupFile(type: FileType, filePath: string): void {
    try {
      if (filePath) {
        const fullPath = this.getFilePath(type, filePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    } catch (error) {
      this.logger.warn(`Error cleaning up files: ${error.message}`);
      throw ApiError.InternalServerError('Failed to clean up files');
    }
  }

  async cleanupHlsSegments(filename: string): Promise<void> {
    const segmentDir = path.resolve(this.basePath, 'hls', filename);
    try {
      if (fs.existsSync(segmentDir)) {
        await fs.promises.rm(segmentDir, { recursive: true, force: true });
        this.logger.log(`HLS segments cleaned up for ${filename}`);
      }
    } catch (error) {
      this.logger.error(`Error cleaning up HLS segments: ${error.message}`);
      throw ApiError.InternalServerError('Failed to clean up HLS segments');
    }
  }

  private getFilePath(type: FileType, fileName: string): string {
    return path.resolve(this.basePath, type, fileName);
  }
}

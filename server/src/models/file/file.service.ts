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
  ): Promise<string | { paths: string[] }> {
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

  private async createImageFiles(file: Express.Multer.File): Promise<{ paths: string[] }> {
    const paths: string[] = [];
    const baseFileName = uuid.v4();

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

    return { paths };
  }

  private async createAudioFile(file: Express.Multer.File): Promise<string> {
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    const isConvertible = ['mp3', 'flac'].includes(fileExtension ?? 'null');
    const outputExtension = isConvertible ? 'm4a' : fileExtension;
    const fileName = `${uuid.v4()}.${outputExtension}`;
    const filePath = this.getFilePath(FileType.AUDIO, fileName);

    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    if (isConvertible) {
      const inputStream = new PassThrough();
      inputStream.end(file.buffer);

      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputStream)
          .inputFormat(fileExtension ?? 'null')
          .audioCodec('aac')
          .audioBitrate(192)
          .outputOptions(['-map 0:a', '-f mp4'])
          .on('stderr', (stderrLine) => {
            this.logger.log(`FFmpeg stderr: ${stderrLine}`);
          })
          .on('end', () => {
            this.logger.log(`Audio converted to AAC (m4a) from ${fileExtension}`, { fileName });
            resolve();
          })
          .on('error', (err) => {
            this.logger.error(`Error converting audio: ${err.message}`);
            reject(err);
          })
          .save(filePath);
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

import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { Logger } from 'nestjs-pino';
import { ApiError } from 'exceptions/api.error';
import { STATIC_FILES_PATH } from 'constants/paths';
import { FileType } from './types';

interface FileBodyType {
  originalname: string;
  buffer: Buffer;
}

@Injectable()
export class FileService {
  constructor(private readonly logger: Logger) {}

  async createFile(type: FileType, file: Express.Multer.File): Promise<string> {
    try {
      file = Array.isArray(file) ? file[0] : file;
      this.logger.log('file createFile', file);
      if (!file || !file.originalname) {
        throw ApiError.BadRequest('File or originalname is missing');
      }
      const fileExtension = file.originalname.split('.').pop();
      this.logger.log('fileExtension createFile', fileExtension);
      const fileName = uuid.v4() + '.' + fileExtension;
      this.logger.log('fileName createFile', fileName);
      const filePath = path.resolve(STATIC_FILES_PATH, type);
      this.logger.log('filePath createFile', filePath);
      if (!fs.existsSync(filePath)) {
        this.logger.log('filePath createFile', filePath);
        fs.mkdirSync(filePath, { recursive: true });
      }
      await fs.promises.writeFile(path.resolve(filePath, fileName), file.buffer);
      return type + '/' + fileName;
    } catch (e) {
      this.logger.error(`Error creating file: ${file.originalname}, ${e.message}`);
      throw ApiError.InternalServerError('Failed to create file', e);
    }
  }

  async createTracks(tracks: FileBodyType[]): Promise<string[]> {
    const tracksPaths: string[] = [];
    const trackPath = path.resolve(STATIC_FILES_PATH, 'audio');
    if (!fs.existsSync(trackPath)) {
      fs.mkdirSync(trackPath, { recursive: true });
    }
    for (const track of tracks) {
      try {
        if (!track || !track.originalname) {
          throw new BadRequestException('Track file or originalname is missing');
        }
        const trackExtension = track.originalname.split('.').pop();
        const trackName = uuid.v4() + '.' + trackExtension;
        const fullTrackPath = path.resolve(trackPath, trackName);

        await fs.promises.writeFile(fullTrackPath, track.buffer);

        tracksPaths.push('audio/' + trackName);
      } catch (e) {
        console.error(`Error creating track: ${track.originalname}, ${e.message}`);
        throw ApiError.InternalServerError('Failed to create track file');
      }
    }

    return tracksPaths;
  }

  cleanupFiles(tracks: string[], coverPath?: string): void {
    try {
      if (coverPath) {
        this.logger.log(`coverPath: ${coverPath}`);
        const fullCoverPath = path.resolve(STATIC_FILES_PATH, coverPath);
        this.logger.log(`fullCoverPath: ${fullCoverPath}`)
        if (fs.existsSync(fullCoverPath)) {
          fs.unlinkSync(fullCoverPath);
        }
      }

      tracks.forEach((track) => {
        const fullTrackPath = path.resolve(STATIC_FILES_PATH, track);
        if (fs.existsSync(fullTrackPath)) {
          fs.unlinkSync(fullTrackPath);
        }
      });
    } catch (error) {
      console.error(`Error cleaning up files: ${error.message}`);
      throw ApiError.InternalServerError('Failed to clean up files');
    }
  }

  cleanupFile(filePath: string): void {
    try {
      if (filePath) {
        const fullCoverPath = path.resolve(STATIC_FILES_PATH, filePath);
        if (fs.existsSync(fullCoverPath)) {
          fs.unlinkSync(fullCoverPath);
        }
      }
    } catch (error) {
      this.logger.warn(`Error cleaning up files: ${error.message}`);
      throw ApiError.InternalServerError('Failed to clean up files');
    }
  }
}

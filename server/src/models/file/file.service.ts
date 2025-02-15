import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { Logger } from 'nestjs-pino';
import { ApiError } from 'exceptions/api.error';
import { FileType } from './types';

interface FileBodyType {
  originalname: string;
  buffer: Buffer;
}

@Injectable()
export class FileService {
  private readonly basePath = path.resolve(__dirname, '../../../static');
  constructor(private readonly logger: Logger) {}

  async createFile(type: FileType, file: Express.Multer.File): Promise<string> {
    try {
      file = Array.isArray(file) ? file[0] : file;
      this.logger.log('Creating file', { originalname: file.originalname });

      if (!file || !file.originalname) {
        throw ApiError.BadRequest('File or originalname is missing');
      }

      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${uuid.v4()}.${fileExtension}`;
      const filePath = this.getFilePath(type, fileName)

      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, file.buffer);
      this.logger.log('Creating file basePath', { basePath: this.basePath});
      this.logger.log('Creating file return', { return: `${type}/${fileName}`});
      return `${type}/${fileName}`;
    } catch (e) {
      this.logger.error(`Error creating file: ${file.originalname}, ${e.message}`);
      throw ApiError.InternalServerError('Failed to create file', e);
    }
  }

  async createFiles(type: FileType, files: FileBodyType[]): Promise<string[]> {
    const filePaths: string[] = [];
    const filePath = this.getFilePath(type, '')

    await fs.promises.mkdir(filePath, { recursive: true });

    for (const file of files) {
      try {
        if (!file || !file.originalname) {
          throw ApiError.BadRequest('File or originalname is missing');
        }

        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuid.v4()}.${fileExtension}`;
        const fullFilePath = this.getFilePath(type, fileName);

        await fs.promises.writeFile(fullFilePath, file.buffer);
        filePaths.push(`audio/${fileName}`);
      } catch (e) {
        console.error(`Error creating files: ${file.originalname}, ${e.message}`);
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
        const fullTrackPath = this.getFilePath(FileType.AUDIO, trackPath)
        if (fs.existsSync(fullTrackPath)) {
          fs.unlinkSync(fullTrackPath);
        }
      });
    } catch (error) {
      console.error(`Error cleaning up files: ${error.message}`);
      throw ApiError.InternalServerError('Failed to clean up files');
    }
  }

  cleanupFile(type: FileType, filePath: string): void {
    try {
      if (filePath) {
        const fullCoverPath = this.getFilePath(type, filePath)
        if (fs.existsSync(fullCoverPath)) {
          fs.unlinkSync(fullCoverPath);
        }
      }
    } catch (error) {
      this.logger.warn(`Error cleaning up files: ${error.message}`);
      throw ApiError.InternalServerError('Failed to clean up files');
    }
  }

  private getFilePath(type: FileType, fileName: string): string {
    return path.resolve(this.basePath, type, fileName);
  }
}

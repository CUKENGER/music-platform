import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid"

export enum FileType {
  AUDIO = "audio",
  IMAGE = "image"
}

interface FileBodyType {
  originalname: string;
  buffer: Buffer;
}

@Injectable()
export class FileService {

  async createFile(type: FileType, file): Promise<string> {
    try {
      file = Array.isArray(file) ? file[0] : file;

      console.log('file createFile', file)

      if (!file || !file.originalname) {
        throw new BadRequestException('File or originalname is missing');
      }

      const fileExtension = file.originalname.split('.').pop();
      console.log('fileExtension createFile', fileExtension)
      const fileName = uuid.v4() + '.' + fileExtension;
      console.log('fileName createFile', fileName)
      const filePath = path.resolve(__dirname, '../../../../', 'server/static', type);
      console.log('filePath createFile', filePath)

      if (!fs.existsSync(filePath)) {
        console.log('mkdir createFile')
        fs.mkdirSync(filePath, { recursive: true });
      }

      await fs.promises.writeFile(path.resolve(filePath, fileName), file.buffer);
      return type + '/' + fileName;
    } catch (e) {
      console.error(`Error creating file: ${e.message}`);
      throw new InternalServerErrorException('Failed to create file');
    }
  }


  async createTracks(tracks: FileBodyType[]): Promise<string[]> {
    const tracksPaths: string[] = [];
    const trackPath = path.resolve(__dirname, '../../../../', 'server/static', 'audio');

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
        throw new InternalServerErrorException('Failed to create track file');
      }
    }

    return tracksPaths;
  }

  cleanupFiles(tracks: string[], coverPath: string): void {
    try {
      if (coverPath) {
        const fullCoverPath = path.resolve(__dirname, '../../../../static', coverPath);
        if (fs.existsSync(fullCoverPath)) {
          fs.unlinkSync(fullCoverPath);
        }
      }

      tracks.forEach(track => {
        const fullTrackPath = path.resolve(__dirname, '../../../../static', track);
        if (fs.existsSync(fullTrackPath)) {
          fs.unlinkSync(fullTrackPath);
        }
      });
    } catch (error) {
      console.error(`Error cleaning up files: ${error.message}`);
    }
  }

  cleanupFile(filePath: string): void {
    try {
      if (filePath) {
        const fullCoverPath = path.resolve(__dirname, '../../../../static', filePath);
        if (fs.existsSync(fullCoverPath)) {
          fs.unlinkSync(fullCoverPath);
        }
      }
    } catch (error) {
      console.error(`Error cleaning up files: ${error.message}`);
    }
  }
}
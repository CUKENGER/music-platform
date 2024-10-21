import { Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import * as ffprobeStatic from 'ffprobe-static';
import * as path from "path";
import * as fs from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class AudioService {

  async getAudioDuration(filePath: string): Promise<string> {
    console.log(`filePath getAudioDuration: ${filePath}`)
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

  private async getAudioDurationFromFile(dp: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      ffmpeg.setFfprobePath(ffprobeStatic.path);
      ffmpeg.ffprobe(dp, (err, metadata) => {
        if (err) {
          reject(new InternalServerErrorException(`Error retrieving file metadata: ${err.message}`));
        } else {
          resolve(metadata.format.duration);
        }
      });
    });
  }

  private resolveFilePath(filePath: string): string {
    return path.resolve(__dirname, '../../../../server/static', filePath);
  }
}

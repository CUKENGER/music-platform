import { Injectable } from "@nestjs/common";
import * as ffprobeStatic from 'ffprobe-static';
import * as path from "path";

@Injectable()
export class AudioService{
    async getAudioDuration(filePath: string): Promise<string> {
        const ffprobePath = ffprobeStatic.path;
        const dp = path.resolve(__dirname, '../../', 'static', filePath)

        const duration = await new Promise<number>((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const ffmpeg = require('fluent-ffmpeg');
            ffmpeg.setFfprobePath(ffprobePath);
            ffmpeg.ffprobe(dp, (err, metadata) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(metadata.format.duration);
                }
                
            });
        });

        const minutes = Math.floor(duration / 60);
        const seconds = Math.round(duration % 60);
        const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        return formattedDuration
    }
}
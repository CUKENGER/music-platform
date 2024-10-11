import { Injectable, InternalServerErrorException, BadRequestException } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid";

export enum AlbumFileType {
    AUDIO = "audio",
    IMAGE = "image"
}

interface FileType {
    originalname: string;
    buffer: Buffer;
}

@Injectable()
export class AlbumFileService {

    createCover(type: AlbumFileType, cover): string {
        try {
            cover = Array.isArray(cover) ? cover[0] : cover;

            if (!cover || !cover.originalname) {
                throw new BadRequestException('Cover file or originalname is missing');
            }

            const coverExtension = cover.originalname.split('.').pop();
            const coverName = uuid.v4() + '.' + coverExtension;
            const coverPath = path.resolve(__dirname, '../../../../', 'static', type);

            if (!fs.existsSync(coverPath)) {
                fs.mkdirSync(coverPath, { recursive: true });
            }

            fs.writeFileSync(path.resolve(coverPath, coverName), cover.buffer);
            return type + '/' + coverName;
        } catch (e) {
            console.error(`Error creating cover: ${e.message}`);
            throw new InternalServerErrorException('Failed to create cover file');
        }
    }

    createTracks(tracks: FileType[]): string[] {
        const tracksPaths: string[] = [];
        for (const track of tracks) {
            try {
                if (!track || !track.originalname) {
                    throw new BadRequestException('Track file or originalname is missing');
                }

                const trackExtension = track.originalname.split('.').pop();
                const trackName = uuid.v4() + '.' + trackExtension;
                const trackPath = path.resolve(__dirname, '../../../../', 'static', 'audio');

                if (!fs.existsSync(trackPath)) {
                    fs.mkdirSync(trackPath, { recursive: true });
                }

                const fullTrackPath = path.resolve(trackPath, trackName);

                fs.writeFileSync(fullTrackPath, track.buffer);
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
}

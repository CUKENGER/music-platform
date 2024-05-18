import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid";


export enum AlbumFileType {
    AUDIO = "audio",
    IMAGE = "image"
}

@Injectable()
export class AlbumFileService{

    createCover(type: AlbumFileType, cover): string {
        try {
            cover = Array.isArray(cover) ? cover[0] : cover;
            if (!cover) {
                throw new Error('File or file.originalname is undefined');
            }
            const coverExtension = cover.originalname.split('.').pop()
            const coverName = uuid.v4() + '.' + coverExtension
            const coverPath = path.resolve(__dirname, '../../../', 'static', type)
            if(!fs.existsSync(coverPath)) {
                fs.mkdirSync(coverPath, {recursive: true})
            }
            fs.writeFileSync(path.resolve(coverPath, coverName), cover.buffer)
            return type + '/' + coverName
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    createTracks(type: AlbumFileType, tracks: Express.Multer.File[]){
        const tracksPaths: string[] = [];
        for (const track of tracks) {
            try {
                if (!track || !track.originalname) {
                    throw new Error('File or file.originalname is undefined');
                }
                
                const trackExtension = track.originalname.split('.').pop();
                const trackName = uuid.v4() + '.' + trackExtension;

                // Создаем путь к папке альбома
                const trackPath = path.resolve(__dirname , '../../../', 'static', 'audio');

                if (!fs.existsSync(trackPath)) {
                    fs.mkdirSync(trackPath, { recursive: true });
                }

                // Записываем файл
                fs.writeFileSync(path.resolve(trackPath, trackName), track.buffer);

                // Добавляем относительный путь к файлу в массив путей
                const oneTrackPath = 'audio/' + trackName
                tracksPaths.push(oneTrackPath);
            } catch (e) {
                throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return tracksPaths;
    }

    removeFile(filename: string) {

    }
    
}
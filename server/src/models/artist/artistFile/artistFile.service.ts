import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid";

export enum ArtistFileType {
    IMAGE = "image"
}

@Injectable()
export class ArtistFileService{

    createCover(type: ArtistFileType, cover): string {
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
}
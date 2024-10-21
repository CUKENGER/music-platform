import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid";

export enum ArtistFileType {
    IMAGE = "image"
}

@Injectable()
export class ArtistFileService{

    async createCover(type: ArtistFileType, file): Promise<string> {
        try {
            file = Array.isArray(file) ? file[0] : file;
            if (!file || !file.originalname) {
                throw new BadRequestException('File or file.originalname is missing');
            }
            const fileExtension = file.originalname.split('.').pop();
            const fileName = uuid.v4() + '.' + fileExtension;
            const filePath = path.resolve(__dirname, '../../../../', 'static', type);
            fs.mkdirSync(filePath, { recursive: true });
            fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
            return type + '/' + fileName;
        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }
}
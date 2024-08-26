import { Module } from "@nestjs/common";
import { AlbumFileService } from "./albumFile.service";

@Module({
    imports: [],
    providers: [AlbumFileService],
    exports: [AlbumFileService]
})
export class AlbumFileModule{

}
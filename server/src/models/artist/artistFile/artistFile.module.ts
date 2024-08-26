import { Module } from "@nestjs/common";
import { ArtistFileService } from "./artistFile.service";


@Module({
    imports: [],
    providers: [ArtistFileService],
    exports: [ArtistFileService]
})
export class ArtistFileModule{

}
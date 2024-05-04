import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AlbumFileService } from "./albumFile.service";


@Module({
    imports: [ConfigModule.forRoot()],
    providers: [AlbumFileService]
})
export class AlbumFileModule{

}
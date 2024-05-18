import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ArtistFileService } from "./artistFile.service";


@Module({
    imports: [ConfigModule.forRoot()],
    providers: [ArtistFileService]
})
export class ArtistFileModule{

}
import { Module } from "@nestjs/common";
import { ArtistController } from "./artist.controller";
import { ArtistService } from "./artist.service";
import { ArtistFileService } from "./artistFile/artistFile.service";
import { PrismaService } from "prisma/prisma.service";
import { ArtistFileModule } from "./artistFile/artistFile.module";

@Module({
    imports: [ArtistFileModule],
    controllers: [ArtistController],
    providers: [ArtistService, PrismaService, ArtistFileService],
    exports: [ArtistService]
  })
  export class ArtistModule {}
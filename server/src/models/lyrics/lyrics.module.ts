import { Module } from "@nestjs/common";
import { LyricsController } from "./lyrics.controller";
import { LyricsService } from "./lyrics.service";
import { HttpModule, HttpService } from "@nestjs/axios";

@Module({
  providers: [LyricsService],
  controllers: [LyricsController],
  imports: [HttpModule],
  exports: [LyricsService]
})
export class LyricsModule {}

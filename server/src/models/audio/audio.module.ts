import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';

@Module({
  imports: [],
  providers: [AudioService],
  controllers: [AudioController],
  exports: [AudioService],
})
export class AudioModule {}

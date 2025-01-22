import { Module } from '@nestjs/common';
import { AudioService } from './audioService.service';

@Module({
  imports: [],
  providers: [AudioService],
  exports: [AudioService],
})
export class AudioModule {}

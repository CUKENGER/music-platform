import EventEmitter from 'eventemitter3';

export interface ChunkData {
  data: ArrayBuffer;
  chunkDuration: number;
  fileSize: number;
}

export class AudioChunkLoader extends EventEmitter {
  private chunkSize: number = 1000000;
  private loadedTime: number = 0;
  private start: number = 0;
  private end: number = this.chunkSize - 1;

  public async loadChunk(
    currentTime: number,
    fetchChunk: (start: number, end: number, signal?: AbortSignal) => Promise<ChunkData | null>,
  ): Promise<ArrayBuffer | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const result = await fetchChunk(this.start, this.end, controller.signal);
      console.log('result audio chunk loader');
      clearTimeout(timeout);
      if (!result) return null;

      const { data, chunkDuration } = result;
      this.loadedTime += chunkDuration;
      console.log('Chunk loaded:', {
        start: this.start,
        end: this.end,
        loadedTime: this.loadedTime,
      });
      this.emit('chunk_chunkupdate', { loadedTime: this.loadedTime });
      return data;
    } catch (error) {
      clearTimeout(timeout);
      console.error('Error fetching audio chunk:', error);
      this.emit('chunk_error', error instanceof Error ? error.message : 'Failed to load chunk');
      return null;
    }
  }

  public getLoadedTime(): number {
    return this.loadedTime;
  }

  public getChunkParams(chunkIndex: number): { start: number; end: number } {
    this.start = chunkIndex * this.chunkSize;
    this.end = this.start + this.chunkSize - 1;
    return { start: this.start, end: this.end };
  }

  public reset(): void {
    this.start = 0;
    this.end = this.chunkSize - 1;
    this.loadedTime = 0;
    this.emit('chunk_chunkupdate', { loadedTime: this.loadedTime });
  }
}

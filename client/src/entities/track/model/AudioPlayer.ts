import EventEmitter from 'eventemitter3';

export class AudioPlayer extends EventEmitter {
  private _audio?: HTMLAudioElement;
  private mediaSource: MediaSource = new MediaSource();
  private sourceBuffer?: SourceBuffer;
  private chunkQueue: Array<ArrayBuffer> = [];
  private isBufferUpdating: boolean = false;

  constructor() {
    super();
    if (typeof window !== 'undefined') {
      this._audio = new Audio();
      this._audio.src = URL.createObjectURL(this.mediaSource);
      this._audio.volume = 1;
      this._audio.addEventListener('timeupdate', () => {
        console.log('Audio timeupdate event:', this._audio?.currentTime);
        this.emit('audio_timeupdate', this.getCurrentTime());
      });
      this._audio.addEventListener('stalled', () => {
        console.log('Audio stalled');
        this.emit('audio_error', 'Audio stalled');
      });
      this._audio.addEventListener('waiting', () => {
        console.log('Audio waiting');
        this.emit('audio_error', 'Audio waiting');
      });
      this._audio.addEventListener('error', (e) => {
        console.error('Audio element error:', e);
        this.emit('audio_error', 'Audio element error');
      });
      this.mediaSource.addEventListener('sourceopen', this.onMediaSourceOpen);
    }
  }

  public getAudio(): HTMLAudioElement | undefined {
    return this._audio;
  }

  public isAudioExist(): boolean {
    return Boolean(this._audio);
  }

  public getCurrentTime(): number {
    return this._audio ? Math.floor(this._audio.currentTime) : 0;
  }

  public seekTo(time: number): void {
    if (this._audio) {
      this._audio.currentTime = time;
      this.emit('audio_timeupdate', this.getCurrentTime());
    }
  }

  public appendAudioChunk(data: ArrayBuffer): void {
    this.chunkQueue.push(data);
    console.log('appendChunks', data);
    this.updateAudioSource();
  }

  private updateAudioSource(): void {
    if (
      this.mediaSource.readyState !== 'open' ||
      !this.sourceBuffer ||
      this.sourceBuffer.updating ||
      this.isBufferUpdating ||
      this.chunkQueue.length === 0
    ) {
      console.log('Cannot update SourceBuffer:', {
        readyState: this.mediaSource.readyState,
        sourceBuffer: !!this.sourceBuffer,
        updating: this.sourceBuffer?.updating,
        isBufferUpdating: this.isBufferUpdating,
        chunkQueueLength: this.chunkQueue.length,
      });
      return;
    }
    const chunk = this.chunkQueue.shift();
    if (chunk) {
      try {
        this.isBufferUpdating = true;
        console.log('Appending chunk to SourceBuffer');
        this.sourceBuffer.appendBuffer(chunk);
      } catch (err) {
        console.error('Error appending buffer:', err);
        this.isBufferUpdating = false;
        this.emit('audio_error', 'Failed to append buffer');
      }
    }
  }

  private onMediaSourceOpen = () => {
    const mimeType =
      MediaSource.isTypeSupported('audio/mpeg; codecs="mp3"') ?
        'audio/mpeg; codecs="mp3"'
      : 'audio/mpeg';
    console.log('Using MIME type:', mimeType);
    try {
      this.sourceBuffer = this.mediaSource.addSourceBuffer(mimeType);
      this.sourceBuffer.addEventListener('updateend', () => {
        this.isBufferUpdating = false;
        this.emit('chunk_chunkupdate', { loadedTime: this._audio?.duration || 0 });
        this.updateAudioSource();
      });
      this.sourceBuffer.addEventListener('error', (e) => {
        console.error('SourceBuffer error:', e);
        this.isBufferUpdating = false;
        this.emit('audio_error', 'SourceBuffer error');
      });
    } catch (err) {
      console.error('Error creating SourceBuffer:', err);
      this.emit('audio_error', 'Failed to create SourceBuffer');
    }
    this.updateAudioSource();
  };

  public play(): void {
    if (this._audio && this.mediaSource.readyState === 'open' && this.chunkQueue.length > 0) {
      this._audio
        .play()
        .then(() => {
          console.log('Audio playing successfully');
          this.emit('audio_play');
        })
        .catch((err) => {
          console.error('Error playing audio:', err);
          this.emit('audio_error', err.message);
        });
    } else if (this._audio) {
      console.log('Waiting for MediaSource to open or chunk to be appended');
      const onSourceOpen = () => {
        if (this._audio && this.mediaSource.readyState === 'open' && this.chunkQueue.length > 0) {
          this._audio
            .play()
            .then(() => {
              console.log('Audio playing successfully after sourceopen');
              this.emit('audio_play');
            })
            .catch((err) => {
              console.error('Error playing audio:', err);
              this.emit('audio_error', err.message);
            });
        }
        this.mediaSource.removeEventListener('sourceopen', onSourceOpen);
      };
      this.mediaSource.addEventListener('sourceopen', onSourceOpen);
    }
  }

  public pause(): void {
    if (this._audio) {
      this._audio.pause();
      this.emit('audio_pause');
    }
  }

  public setVolume(volume: number): void {
    if (this._audio) {
      this._audio.volume = volume;
    }
  }

  public cleanup(): void {
    if (this.sourceBuffer && this.mediaSource.readyState === 'open') {
      try {
        this.sourceBuffer.abort();
        // Не вызываем endOfStream(), чтобы сохранить MediaSource открытым
        console.log('Aborted SourceBuffer, keeping MediaSource open');
      } catch (err) {
        console.error('Error during cleanup:', err);
      }
    }
    this.chunkQueue = [];
    if (this._audio) {
      this._audio.pause();
      // Не пересоздаём MediaSource, если не нужно
      URL.revokeObjectURL(this._audio.src);
      this._audio.src = '';
      this.mediaSource = new MediaSource();
      this._audio.src = URL.createObjectURL(this.mediaSource);
      this.mediaSource.addEventListener('sourceopen', this.onMediaSourceOpen);
    }
    this.emit('audio_cleanup');
  }

  public resetMediaSource(): void {
    if (this._audio) {
      this._audio.pause();
      URL.revokeObjectURL(this._audio.src);
      this._audio.src = '';
      this.mediaSource = new MediaSource();
      this._audio.src = URL.createObjectURL(this.mediaSource);
      this.mediaSource.addEventListener('sourceopen', this.onMediaSourceOpen);
    }
    this.chunkQueue = [];
    this.sourceBuffer = undefined;
    this.isBufferUpdating = false;
  }
}

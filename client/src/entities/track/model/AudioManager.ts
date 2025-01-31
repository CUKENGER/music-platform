

class AudioManager {
  private static instance: AudioManager;
  private _audio?: HTMLAudioElement;
  private chunkQueue: Array<ArrayBuffer> = [];
  private mediaSource: MediaSource = new MediaSource();
  private sourceBuffer?: SourceBuffer;
  private isBufferUpdating: boolean = false;
  private isFirstChunk: boolean = true;

  private constructor() {
    if (typeof window !== 'undefined') {
      this._audio = new Audio();
      this.mediaSource = new MediaSource();

      this._audio.src = URL.createObjectURL(this.mediaSource);
      this._audio.volume = 1;
      this.mediaSource.addEventListener('sourceopen', this.onMediaSourceOpen);
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public getAudio(): HTMLAudioElement | undefined {
    return this._audio;
  }

  public isAudioExist(): boolean {
    return Boolean(this._audio);
  }

  public getCurrentTime(): number | undefined {
    return this._audio?.currentTime;
  }

  public seekTo(time: number): void {
    if (this._audio) {
      this._audio.currentTime = time;
    }
  }

  public appendAudioChunk(data: ArrayBuffer): void {
    this.chunkQueue.push(data);
    // console.log("chunkQueue", this.chunkQueue);
    this.updateAudioSource();
  }

  private updateAudioSource(): void {
    // console.log("sourceBuffer created:", this.sourceBuffer);
    // console.log("MediaSource readyState:", this.mediaSource.readyState);
    if (this.mediaSource.readyState !== 'open') {
      // console.log("MediaSource is closed, can't append buffer.");
      return;
    }
    if (
      this.mediaSource.readyState === 'open' &&
      this.sourceBuffer &&
      !this.sourceBuffer.updating &&
      !this.isBufferUpdating &&
      this.chunkQueue.length > 0
    ) {
      const chunk = this.chunkQueue.shift();
      // console.log("chunk", chunk);
      if (chunk) {
        this.isBufferUpdating = true;
        // console.log("sourceBuffer before:", this.sourceBuffer);
        // console.log(
        // "sourceBuffer updating before:",
        // this.sourceBuffer.updating
        // );
        this.sourceBuffer.appendBuffer(chunk);
        this.play();
        // console.log("sourceBuffer", this.sourceBuffer);
        // console.log("sourceBuffer updating after:", this.sourceBuffer.updating);
      }
    }
  }

  private onMediaSourceOpen = () => {
    // console.log("MediaSource opened");
    // console.log("MediaSource readyState:", this.mediaSource.readyState);
    this.sourceBuffer = this.mediaSource.addSourceBuffer('audio/mpeg');

    this.mediaSource.addEventListener('sourceended', () => {
      // console.log("MediaSource ended.");
    });
    this.mediaSource.addEventListener('error', (e) => {
      console.error('MediaSource error:', e);
    });

    this.sourceBuffer.addEventListener('updateend', () => {
      console.log('Updateend triggered');
      this.isBufferUpdating = false;
      if (this.isFirstChunk) {
        this.isFirstChunk = false;
        this.play();
      }
      this.updateAudioSource();
    });
    this.sourceBuffer.addEventListener('error', (e) => {
      console.error('Error with source buffer:', e);
    });

    this.updateAudioSource();
  };

  public play(): void {
    this._audio?.play().catch((err) => console.error('Error playing audio:', err));
  }

  public pause(): void {
    this._audio?.pause();
  }

  public setVolume(volume: number): void {
    if (this._audio) {
      this._audio.volume = volume;
    }
  }

  public cleanup(): void {
    if (this.sourceBuffer && this.mediaSource.readyState === 'open') {
      this.sourceBuffer.abort();
      // this.mediaSource.endOfStream()
    }
    this.chunkQueue = [];
    this.isFirstChunk = true;
    this._audio?.pause();
    if (this._audio) {
      this._audio.src = '';
      this.mediaSource = new MediaSource();
      this._audio.src = URL.createObjectURL(this.mediaSource);
      this.mediaSource.addEventListener('sourceopen', this.onMediaSourceOpen);
    }
    // this._audio?.removeAttribute('src')
    // this._audio?.load()
  }
}

const audioManager = AudioManager.getInstance();
export default audioManager;

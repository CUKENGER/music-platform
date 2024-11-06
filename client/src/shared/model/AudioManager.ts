class AudioManager {
  private static instance: AudioManager;
  private _audio?: HTMLAudioElement;
  private mediaSource?: MediaSource;
  private sourceBuffer?: SourceBuffer;
  private currentChunkIndex = 0;

  private constructor() {
    if (typeof window !== 'undefined') {
      this._audio = new Audio();
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public get audio(): HTMLAudioElement | undefined {
    return this._audio;
  }

  // Инициализация MediaSource и привязка к <audio>
  public initializeMediaSource() {
    this.mediaSource = new MediaSource();
    this._audio!.src = URL.createObjectURL(this.mediaSource);
    
    this.mediaSource.addEventListener('sourceopen', () => {
      this.sourceBuffer = this.mediaSource!.addSourceBuffer('audio/mpeg');
    });
  }

  // Метод для добавления чанков аудио в буфер
  public appendAudioChunk(data: ArrayBuffer) {
    if (this.sourceBuffer && !this.sourceBuffer.updating) {
      this.sourceBuffer.appendBuffer(data);
      this.currentChunkIndex += 1;
    }
  }

  public pause(): void {
    if (this._audio) {
      this._audio.pause();
    }
  }

  public setVolume(volume: number): void {
    if (this._audio) {
      this._audio.volume = volume;
    }
  }
}

const audioManager = AudioManager.getInstance();
Object.freeze(audioManager);

export default audioManager;

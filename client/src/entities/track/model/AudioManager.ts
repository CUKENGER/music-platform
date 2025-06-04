import Hls from 'hls.js';

class AudioManager {
  private static instance: AudioManager;
  private _audio?: HTMLAudioElement;
  private hls?: Hls;
  private onTimeUpdateCallback?: (currentTime: number) => void;
  private onBufferUpdateCallback?: (loadedTime: number) => void;

  private constructor() {
    if (typeof window === 'undefined') {
      console.warn('Окружение window недоступно');
      return;
    }

    this._audio = new Audio();
    this._audio.volume = 1;
    this._audio.addEventListener('timeupdate', this.handleTimeUpdate);

    if (Hls.isSupported()) {
      this.hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      this.hls.on(Hls.Events.BUFFER_APPENDED, this.handleBufferAppended);
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

  public getDuration(): number | undefined {
    return this._audio?.duration;
  }

  public getLoadedTime(): number | undefined {
    if (!this._audio || !this._audio.buffered.length) return 0;
    return this._audio.buffered.end(this._audio.buffered.length - 1);
  }

  public setTimeUpdateCallback(callback: (currentTime: number) => void): void {
    this.onTimeUpdateCallback = callback;
  }

  public setBufferUpdateCallback(callback: (loadedTime: number) => void): void {
    this.onBufferUpdateCallback = callback;
  }

  public seekTo(time: number): void {
    if (this._audio) {
      this._audio.currentTime = time;
    }
  }

  public loadHlsSource(url: string): void {
    if (!this._audio) {
      console.error('Аудио элемент не инициализирован');
      return;
    }

    if (this.hls && Hls.isSupported()) {
      this.hls.loadSource(url);
      this.hls.attachMedia(this._audio);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.play();
      });
      this.hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
      });
    } else if (this._audio.canPlayType('application/vnd.apple.mpegurl')) {
      this._audio.src = url;
      this.play();
    } else {
      console.error('HLS не поддерживается ни через hls.js, ни нативно');
    }
  }

  public play(): void {
    if (this._audio) {
      this._audio.play().catch((err) => console.error('Ошибка воспроизведения:', err));
    }
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
    if (this.hls) {
      this.hls.destroy();
      this.hls = undefined;
    }
    if (this._audio) {
      this._audio.pause();
      this._audio.src = '';
      this._audio.load();
      this._audio.removeEventListener('timeupdate', this.handleTimeUpdate);
    }
  }

  private handleTimeUpdate = (): void => {
    if (this.onTimeUpdateCallback && this._audio) {
      this.onTimeUpdateCallback(this._audio.currentTime);
    }
  };

  private handleBufferAppended = (): void => {
    if (this.onBufferUpdateCallback && this._audio) {
      const loadedTime = this.getLoadedTime() || 0;
      this.onBufferUpdateCallback(loadedTime);
    }
  };
}

const audioManager = AudioManager.getInstance();
export default audioManager;

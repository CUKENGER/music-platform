import Hls, { ErrorData, Events, Level, FragBufferedData } from 'hls.js';

class AudioManager {
  private static instance: AudioManager;
  private _audio?: HTMLAudioElement;
  private hls?: Hls;
  private onTimeUpdateCallback?: (currentTime: number) => void;
  private onBufferUpdateCallback?: (loadedTime: number) => void;
  private bufferLimit = 10; // Лимит буфера вперед в секундах (~5 сегментов)
  private isLoading = false; // Флаг для загрузки
  private isSeeking = false; // Флаг для перемотки
  private lastBufferCheck = 0; // Для debounce

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
        autoStartLoad: false,
        maxBufferLength: 10,
        maxMaxBufferLength: 20,
        maxBufferSize: 320 * 1024,
        liveSyncDurationCount: 3,
        backBufferLength: 3600,
        abrEwmaDefaultEstimate: 256000,
      });
      this.hls.on(Events.BUFFER_APPENDED, this.handleBufferAppended);
      this.hls.on(Events.MANIFEST_PARSED, this.handleManifestParsed);
      this.hls.on(Events.ERROR, this.handleError);
      this.hls.on(Events.FRAG_BUFFERED, this.handleFragmentBuffered);
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

  public async seekTo(time: number, onSeekComplete?: (playing: boolean) => void): Promise<void> {
    if (this._audio && this.hls) {
      const duration = this.getDuration() || 0;
      if (time >= 0 && time <= duration) {
        if (this.isSeeking) {
          console.warn('Seek in progress, ignoring new seek request');
          onSeekComplete?.(this._audio.paused === false);
          return;
        }

        this.isSeeking = true;
        this._audio.currentTime = time;

        // Проверяем, есть ли сегмент в буфере
        const buffered = this._audio.buffered;
        let segmentExists = false;
        for (let i = 0; i < buffered.length; i++) {
          if (buffered.start(i) <= time && time <= buffered.end(i)) {
            segmentExists = true;
            break;
          }
        }

        try {
          if (!segmentExists) {
            this.hls.stopLoad();
            this.isLoading = false;
            await new Promise<void>((resolve, reject) => {
              const onFragBuffered = (_event: string, data: FragBufferedData) => {
                if (data.frag.start <= time && time <= data.frag.start + data.frag.duration) {
                  this.hls?.off(Events.FRAG_BUFFERED, onFragBuffered);
                  resolve();
                }
              };
              this.hls?.on(Events.FRAG_BUFFERED, onFragBuffered);
              this.hls?.startLoad(time);

              // Таймаут на случай, если сегмент не загрузится
              setTimeout(() => reject(new Error('Seek timeout')), 5000);
            });
          }

          // Проверяем, был ли трек на паузе до перемотки
          const wasPlaying = !this._audio.paused;
          if (wasPlaying) {
            await this._audio.play();
          }

          this.isSeeking = false;
          this.checkBufferAndLoad();
          onSeekComplete?.(wasPlaying);
        } catch (err) {
          console.error('Seek error:', err);
          this.isSeeking = false;
          this.checkBufferAndLoad();
          onSeekComplete?.(false);
        }
      } else {
        console.error(`Invalid seek time: ${time}, duration: ${duration}`);
        this.isSeeking = false;
        onSeekComplete?.(this._audio?.paused === false);
      }
    }
  }

  public loadHlsSource(url: string): void {
    if (!this._audio) {
      console.error('Аудио элемент не инициализирован');
      return;
    }

    this.cleanup();

    if (this.hls && Hls.isSupported()) {
      this.hls.loadSource(url);
      this.hls.attachMedia(this._audio);
    } else if (this._audio.canPlayType('application/vnd.apple.mpegurl')) {
      this._audio.src = url;
      this.play();
    } else {
      console.error('HLS не поддерживается ни через hls.js, ни нативно');
    }
  }

  public async play(): Promise<void> {
    if (this._audio) {
      this.checkBufferAndLoad();
      try {
        await this._audio.play();
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.warn('Play interrupted, retrying in 500ms...');
          await new Promise((resolve) => setTimeout(resolve, 500));
          await this.play();
        } else {
          console.error('Ошибка воспроизведения:', err);
          throw err;
        }
      }
    }
  }

  public pause(): void {
    this._audio?.pause();
    if (this.hls) {
      this.hls.stopLoad();
      this.isLoading = false;
    }
  }

  public setVolume(volume: number): void {
    if (this._audio) {
      this._audio.volume = volume;
    }
  }

  public cleanup(): void {
    if (this.hls) {
      this.hls.stopLoad();
      this.isLoading = false;
      this.hls.detachMedia();
      this.hls.destroy();
      this.hls = undefined;
      if (Hls.isSupported()) {
        this.hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          autoStartLoad: false,
          maxBufferLength: 10,
          maxMaxBufferLength: 20,
          maxBufferSize: 320 * 1024,
          liveSyncDurationCount: 3,
          backBufferLength: 3600,
          abrEwmaDefaultEstimate: 256000,
        });
        this.hls.on(Events.BUFFER_APPENDED, this.handleBufferAppended);
        this.hls.on(Events.MANIFEST_PARSED, this.handleManifestParsed);
        this.hls.on(Events.ERROR, this.handleError);
        this.hls.on(Events.FRAG_BUFFERED, this.handleFragmentBuffered);
      }
    }
    if (this._audio) {
      this._audio.pause();
      this._audio.src = '';
      this._audio.load();
      this._audio.removeEventListener('timeupdate', this.handleTimeUpdate);
      this._audio = new Audio();
      this._audio.volume = 1;
      this._audio.addEventListener('timeupdate', this.handleTimeUpdate);
    }
  }

  private handleTimeUpdate = (): void => {
    if (this.onTimeUpdateCallback && this._audio) {
      this.onTimeUpdateCallback(this._audio.currentTime);
      this.checkBufferAndLoad();
    }
  };

  private handleBufferAppended = (): void => {
    if (this.onBufferUpdateCallback && this._audio) {
      const loadedTime = this.getLoadedTime() || 0;
      this.onBufferUpdateCallback(loadedTime);
    }
  };

  private handleFragmentBuffered = (_event: string, data: FragBufferedData): void => {
    console.log(`Сегмент забуферизирован: ${data.frag.url}, длительность: ${data.frag.duration}s`);
    this.checkBufferAndLoad();
  };

  private handleManifestParsed = (): void => {
    if (this.hls) {
      console.log(
        'Available qualities:',
        this.hls.levels.map((l: Level) => `${l.bitrate / 1024} kbps`),
      );
      this.play();
    }
  };

  private handleError = (_event: string, data: ErrorData): void => {
    console.error(`HLS error: ${data.type}, details: ${data.details}, url: ${data.url || 'unknown'}`, data);
    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          console.warn('Network error, retrying in 2s...');
          setTimeout(() => {
            if (this.hls) {
              this.hls.startLoad();
              this.isLoading = true;
            }
          }, 2000);
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          console.warn('Media error, attempting to recover in 500ms...');
          setTimeout(() => {
            if (this.hls) {
              this.hls.recoverMediaError();
              if (!this.isLoading) {
                this.hls.startLoad();
                this.isLoading = true;
              }
            }
          }, 500);
          break;
        default:
          console.error('Unrecoverable error, destroying HLS instance');
          this.cleanup();
          break;
      }
    }
  };

  private checkBufferAndLoad = (): void => {
    if (!this.hls || !this._audio) return;

    const now = performance.now();
    if (now - this.lastBufferCheck < 500) return; // Debounce 500 мс
    this.lastBufferCheck = now;

    const currentTime = this.getCurrentTime() || 0;
    const loadedTime = this.getLoadedTime() || 0;

    if (this.isSeeking) {
      if (!this.isLoading) {
        this.hls.startLoad();
        this.isLoading = true;
        console.log(`Загрузка при перемотке: буфер ${loadedTime - currentTime}s`);
      }
      return;
    }

    if (loadedTime - currentTime > this.bufferLimit) {
      if (this.isLoading) {
        this.hls.stopLoad();
        this.isLoading = false;
        console.log(`Загрузка остановлена: буфер ${loadedTime - currentTime}s`);
      }
    } else if (!this.isLoading) {
      this.hls.startLoad();
      this.isLoading = true;
      console.log(`Загрузка возобновлена: буфер ${loadedTime - currentTime}s`);
    }
  };
}

export default AudioManager.getInstance();

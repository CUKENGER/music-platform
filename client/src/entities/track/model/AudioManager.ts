import Hls, { ErrorData, Events, Level, FragBufferedData, ManifestParsedData } from 'hls.js';

class AudioManager {
  private static instance: AudioManager;
  private _audio?: HTMLAudioElement;
  private hls?: Hls;
  private onSeekCompleteCallback?: (playing: boolean) => void;
  private bufferLimit = 10; // Как в старой версии
  private isLoading = false;
  private isSeeking = false;
  private lastBufferCheck = 0;

  private constructor() {
    if (typeof window === 'undefined') {
      console.warn('window недоступен');
      return;
    }

    this._audio = new Audio();
    this._audio.volume = 1;
    this._audio.addEventListener('timeupdate', this.handleTimeUpdate); // Восстанавливаем timeupdate

    if (Hls.isSupported()) {
      this.initHls();
    }
  }

  private initHls(): void {
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
    this.hls.on(Events.MANIFEST_LOADED, this.handleManifestLoaded);
    this.hls.on(Events.MANIFEST_PARSED, this.handleManifestParsed);
    this.hls.on(Events.ERROR, this.handleError);
    this.hls.on(Events.FRAG_BUFFERED, this.handleFragmentBuffered);
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

  public setSeekCompleteCallback(callback?: (playing: boolean) => void): void {
    this.onSeekCompleteCallback = callback;
  }

  public async seekTo(time: number): Promise<void> {
    if (this._audio && this.hls) {
      const duration = this.getDuration() || 0;
      if (time >= 0 && time <= duration) {
        if (this.isSeeking) {
          console.warn('Перемотка уже выполняется, игнорирую');
          this.onSeekCompleteCallback?.(this._audio.paused === false);
          return;
        }

        this.isSeeking = true;
        this._audio.currentTime = time;

        try {
          const buffered = this._audio.buffered;
          let segmentExists = false;
          for (let i = 0; i < buffered.length; i++) {
            if (buffered.start(i) <= time && time <= buffered.end(i)) {
              segmentExists = true;
              break;
            }
          }

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
              setTimeout(() => reject(new Error('Таймаут перемотки')), 2000);
            });
          }

          await this.waitForCanPlay();
          await this._audio.play();

          this.isSeeking = false;
          this.checkBufferAndLoad();
          this.onSeekCompleteCallback?.(true);
        } catch (err) {
          console.error('Ошибка перемотки:', err);
          this.isSeeking = false;
          this.checkBufferAndLoad();
          this.onSeekCompleteCallback?.(false);
        }
      } else {
        console.error(`Недопустимое время перемотки: ${time}, длительность: ${duration}`);
        this.isSeeking = false;
        this.onSeekCompleteCallback?.(this._audio?.paused === false);
      }
    }
  }

  private async waitForCanPlay(): Promise<void> {
    if (!this._audio) return;
    return new Promise((resolve) => {
      const onCanPlay = () => {
        this._audio?.removeEventListener('canplay', onCanPlay);
        resolve();
      };
      this._audio?.addEventListener('canplay', onCanPlay, { once: true });
    });
  }

  public async play(): Promise<void> {
    if (this._audio) {
      this.checkBufferAndLoad();
      try {
        await this.waitForCanPlay();
        await this._audio.play();
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.warn('Воспроизведение прервано, повтор через 200мс...');
          await new Promise((resolve) => setTimeout(resolve, 200));
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

  public async loadHlsSource(url: string): Promise<void> {
    if (!this._audio) {
      console.error('Аудио элемент не инициализирован');
      return;
    }

    this.cleanup();

    if (this.hls && Hls.isSupported()) {
      this.hls.loadSource(url);
      this.hls.attachMedia(this._audio);
      await new Promise<void>((resolve) => {
        this.hls?.once(
          Events.MANIFEST_PARSED,
          (_event: Events.MANIFEST_PARSED, _data: ManifestParsedData) => resolve(),
        );
      });
      this.checkBufferAndLoad();
    } else if (this._audio.canPlayType('application/vnd.apple.mpegurl')) {
      this._audio.src = url;
      await this.play();
    } else {
      console.error('HLS не поддерживается');
    }
  }

  public cleanup(): void {
    if (this.hls) {
      this.hls.stopLoad();
      this.isLoading = false;
      this.hls.detachMedia();
      this.hls.destroy();
      this.hls = undefined;
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
    if (Hls.isSupported()) {
      this.initHls();
    }
  }

  private handleTimeUpdate = (): void => {
    this.checkBufferAndLoad();
  };

  private handleFragmentBuffered = (_event: string, data: FragBufferedData): void => {
    console.log(`Сегмент забуферизирован: ${data.frag.url}, длительность: ${data.frag.duration}s`);
    this.checkBufferAndLoad();
  };

  private handleManifestLoaded = (): void => {
    if (this.hls) {
      this.hls.startLoad();
      this.isLoading = true;
    }
  };

  private handleManifestParsed = (): void => {
    if (this.hls) {
      console.log(
        'Доступные качества:',
        this.hls.levels.map((l: Level) => `${l.bitrate / 1024} kbps`),
      );
      if (this.hls.levels.length > 0) {
        this.hls.currentLevel = 0;
      }
      this.play();
    }
  };

  private handleError = (_event: string, data: ErrorData): void => {
    console.error(
      `HLS ошибка: ${data.type}, детали: ${data.details}, url: ${data.url || 'unknown'}`,
      data,
    );
    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          console.warn('Network error, повтор через 500мс...');
          setTimeout(() => {
            if (this.hls) {
              this.hls.startLoad();
              this.isLoading = true;
            }
          }, 500);
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          console.warn('Media error, восстановление через 200мс...');
          setTimeout(() => {
            if (this.hls) {
              this.hls.recoverMediaError();
              if (!this.isLoading) {
                this.hls.startLoad(this.getCurrentTime() || 0);
                this.isLoading = true;
              }
            }
          }, 200);
          break;
        default:
          console.error('Unrecoverable error, уничтожаю HLS');
          this.cleanup();
          break;
      }
    } else if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
      console.warn('Buffer stalled, немедленно загружаю следующий сегмент...');
      if (this.hls && !this.isLoading) {
        const currentTime = this.getCurrentTime() || 0;
        this.hls.startLoad(currentTime);
        this.isLoading = true;
        this.checkBufferAndLoad();
      }
    }
  };

  private checkBufferAndLoad(): void {
    if (!this.hls || !this._audio) return;

    const now = performance.now();
    if (now - this.lastBufferCheck < 500) return; // Как в старой версии
    this.lastBufferCheck = now;

    const currentTime = this.getCurrentTime() || 0;
    const loadedTime = this.getLoadedTime() || 0;
    const bufferLength = loadedTime - currentTime;

    console.log(
      `Проверка буфера: currentTime=${currentTime.toFixed(2)}s, loadedTime=${loadedTime.toFixed(2)}s, bufferLength=${bufferLength.toFixed(2)}s`,
    );

    if (this.isSeeking) {
      if (!this.isLoading) {
        this.hls.startLoad(currentTime);
        this.isLoading = true;
        console.log(`Загрузка при перемотке: буфер ${bufferLength}s`);
      }
      return;
    }

    if (bufferLength > this.bufferLimit) {
      if (this.isLoading) {
        this.hls.stopLoad();
        this.isLoading = false;
        console.log(`Загрузка остановлена: буфер ${bufferLength}s`);
      }
    } else if (!this.isLoading) {
      this.hls.startLoad(currentTime);
      this.isLoading = true;
      console.log(`Загрузка возобновлена: буфер ${bufferLength}s`);
    }
  }
}

export default AudioManager.getInstance();

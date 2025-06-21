import Hls, { ErrorData, Events, FragBufferedData } from 'hls.js';

interface TrackSwitchCallback {
  onTrackEnded: () => void;
}

class AudioManager {
  private static instance: AudioManager;
  private _audio?: HTMLAudioElement;
  private hls?: Hls;
  private bufferLimit = 10;
  private isLoading = false;
  private isSeeking = false;
  private lastBufferCheck = 0;
  private trackSwitchCallback?: TrackSwitchCallback;
  private onSeekCompleteCallback?: (playing: boolean) => void;

  private constructor() {
    if (typeof window === 'undefined') {
      console.warn('window недоступен');
      return;
    }

    this.initializeAudio();
    if (Hls.isSupported()) {
      this.initHls();
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private initializeAudio(): void {
    this._audio = new Audio();
    this._audio.volume = 1;
    this._audio.addEventListener('timeupdate', this.handleTimeUpdate);
    this._audio.addEventListener('ended', this.handleTrackEnded);
    this._audio.addEventListener('canplay', this.handleCanPlay);
    this._audio.addEventListener('playing', this.handlePlaying); // Добавляем обработчик playing
  }

  private handleCanPlay = (): void => {
    this.checkBufferAndLoad();
    this._audio?.dispatchEvent(new Event('timeupdate')); // Принудительный вызов timeupdate
  };

  private handlePlaying = (): void => {
    this._audio?.dispatchEvent(new Event('timeupdate')); // Принудительный вызов timeupdate
  };

  public setTrackSwitchCallback(callback: TrackSwitchCallback): void {
    this.trackSwitchCallback = callback;
  }

  public setSeekCompleteCallback(callback?: (playing: boolean) => void): void {
    this.onSeekCompleteCallback = callback;
  }

  private handleTrackEnded = () => {
    this.trackSwitchCallback?.onTrackEnded();
  };

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

  public getAudio(): HTMLAudioElement | undefined {
    return this._audio;
  }

  public getCurrentTime(): number | undefined {
    const time = this._audio?.currentTime;
    return time;
  }

  public getDuration(): number | undefined {
    const duration = this._audio?.duration;
    return duration;
  }

  public getLoadedTime(): number | undefined {
    if (!this._audio || !this._audio.buffered.length) {
      return 0;
    }
    const loaded = this._audio.buffered.end(this._audio.buffered.length - 1);
    return loaded;
  }

  public async seekTo(time: number): Promise<void> {
    if (!this._audio || !this.hls) {
      console.warn('seekTo: Аудио или HLS не инициализированы');
      this.onSeekCompleteCallback?.(false);
      return;
    }

    const duration = this.getDuration() || 0;
    if (time < 0 || time > duration) {
      console.error(`seekTo: Недопустимое время ${time}, длительность: ${duration}`);
      this.onSeekCompleteCallback?.(false);
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
          setTimeout(() => reject(new Error('Таймаут перемотки')), 5000); // 5 сек
        });
      }

      await this.waitForCanPlay();
      if (this._audio.paused) {
        await this._audio.play();
        this.onSeekCompleteCallback?.(true);
      } else {
        this.onSeekCompleteCallback?.(true);
      }
      this.isSeeking = false;
      this.checkBufferAndLoad();
      this._audio.dispatchEvent(new Event('timeupdate')); // Принудительный вызов timeupdate
    } catch (err) {
      console.error('seekTo: Ошибка перемотки:', err);
      this.isSeeking = false;
      this.checkBufferAndLoad();
      this.onSeekCompleteCallback?.(false);
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
    if (!this._audio) {
      console.error('play: Аудио не инициализировано');
      return;
    }

    this.checkBufferAndLoad();
    try {
      if (this._audio.readyState >= 2) {
        await this._audio.play();
      } else {
        await this.waitForCanPlay();
        await this._audio.play();
      }
      this._audio.dispatchEvent(new Event('timeupdate')); // Принудительный вызов timeupdate
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.warn('play: Воспроизведение прервано, повтор через 200мс...');
        await new Promise((resolve) => setTimeout(resolve, 200));
        await this.play();
      } else {
        console.error('play: Ошибка воспроизведения:', err);
        throw err;
      }
    }
  }

  public pause(): void {
    if (this._audio) {
      this._audio.pause();
    }
    if (this.hls) {
      this.hls.stopLoad();
      this.isLoading = false;
    }
  }

  public setVolume(volume: number): void {
    if (this._audio) {
      this._audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  public async loadHlsSource(url: string): Promise<void> {
    if (!this._audio) {
      console.error('loadHlsSource: Аудио элемент не инициализирован');
      return;
    }

    this.cleanup();

    if (this.hls && Hls.isSupported()) {
      this.hls.loadSource(url);
      this.hls.attachMedia(this._audio);
      await new Promise<void>((resolve) => {
        this.hls?.once(Events.MANIFEST_PARSED, () => {
          resolve();
        });
      });

      await this.waitForCanPlay();
      await this.seekTo(0);
      await this.play();
      this.checkBufferAndLoad();
      this._audio.dispatchEvent(new Event('timeupdate')); // Принудительный вызов timeupdate
    } else if (this._audio.canPlayType('application/vnd.apple.mpegurl')) {
      this._audio.src = url;
      await this.play();
      this._audio.dispatchEvent(new Event('timeupdate')); // Принудительный вызов timeupdate
    } else {
      console.error('loadHlsSource: HLS не поддерживается');
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
      this._audio.currentTime = 0;
      this._audio.removeEventListener('timeupdate', this.handleTimeUpdate);
      this._audio.removeEventListener('ended', this.handleTrackEnded);
      this._audio.removeEventListener('canplay', this.handleCanPlay);
      this._audio.removeEventListener('playing', this.handlePlaying);
    }
    this.initializeAudio();
    if (Hls.isSupported()) {
      this.initHls();
    }
  }

  private handleTimeUpdate = (): void => {
    this.checkBufferAndLoad();
  };

  private handleFragmentBuffered = (_event: string, _data: FragBufferedData): void => {
    this.checkBufferAndLoad();
    this._audio?.dispatchEvent(new Event('timeupdate')); // Принудительный вызов timeupdate
  };

  private handleManifestLoaded = (): void => {
    if (this.hls) {
      this.hls.startLoad();
      this.isLoading = true;
    }
  };

  private handleManifestParsed = (): void => {
    if (this.hls) {
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
          console.warn('handleError: Network error, повтор через 500мс...');
          setTimeout(() => {
            if (this.hls) {
              this.hls.startLoad();
              this.isLoading = true;
              this._audio?.dispatchEvent(new Event('timeupdate')); // Принудительный вызов
            }
          }, 500);
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          console.warn('handleError: Media error, восстановление через 200мс...');
          setTimeout(() => {
            if (this.hls) {
              this.hls.recoverMediaError();
              if (!this.isLoading) {
                this.hls.startLoad(this.getCurrentTime() || 0);
                this.isLoading = true;
              }
              this._audio?.dispatchEvent(new Event('timeupdate')); // Принудительный вызов
            }
          }, 200);
          break;
        default:
          console.error('handleError: Unrecoverable error, уничтожаю HLS');
          this.cleanup();
          break;
      }
    } else if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
      console.warn('handleError: Buffer stalled, немедленно загружаю следующий сегмент...');
      if (this.hls && !this.isLoading) {
        const currentTime = this.getCurrentTime() || 0;
        this.hls.startLoad(currentTime);
        this.isLoading = true;
        this.checkBufferAndLoad();
        this._audio?.dispatchEvent(new Event('timeupdate')); // Принудительный вызов
      }
    }
  };

  private checkBufferAndLoad(): void {
    if (!this.hls || !this._audio || this._audio.paused) {
      return;
    }

    const now = performance.now();
    if (now - this.lastBufferCheck < 1000) return;
    this.lastBufferCheck = now;

    const currentTime = this.getCurrentTime() || 0;
    const loadedTime = this.getLoadedTime() || 0;
    const bufferLength = loadedTime - currentTime;

    if (this.isSeeking) {
      if (!this.isLoading) {
        this.hls.startLoad(currentTime);
        this.isLoading = true;
      }
      return;
    }

    if (bufferLength > this.bufferLimit) {
      if (this.isLoading) {
        this.hls.stopLoad();
        this.isLoading = false;
      }
    } else if (!this.isLoading) {
      this.hls.startLoad(currentTime);
      this.isLoading = true;
    }
  }
}

export default AudioManager.getInstance();

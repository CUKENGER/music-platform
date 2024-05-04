'use client'

class AudioManager {
    private static instance: AudioManager;
    private _audio?: HTMLAudioElement; // Сделали _audio необязательным

    private constructor() {
        if (typeof window !== 'undefined') { // Проверяем, что код выполняется в браузере
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
  
    public play(url: string): void {
        if (this._audio) {
            this._audio.src = url;
            this._audio.play();
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


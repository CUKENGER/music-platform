import { AudioPlayer } from './AudioPlayer';
import { TrackManager } from './TrackManager';
import { ITrack } from '../types/Track';
import { AudioChunkLoader, ChunkData } from './AudioChunkLoader';

type PlayerEvent =
  | { type: 'timeupdate'; args: [number] }
  | { type: 'error'; args: [Error] }
  | { type: 'ended'; args: [] }
  | { type: 'loaded'; args: [ChunkData] };

// Тип для слушателя событий
type EventListener<T extends PlayerEvent['type']> = (
  ...args: Extract<PlayerEvent, { type: T }>['args']
) => void;

export class PlayerManager {
  private audioPlayer: AudioPlayer;
  private chunkLoader: AudioChunkLoader;
  private trackManager: TrackManager;

  constructor() {
    this.audioPlayer = new AudioPlayer();
    this.chunkLoader = new AudioChunkLoader();
    this.trackManager = new TrackManager();

    this.audioPlayer.on('audio_timeupdate', (currentTime: number) => {
      this.trackManager.handleTrackEnd(currentTime);
    });
  }

  public async loadChunkIfNeeded(
    currentTime: number,
    fetchChunk: (start: number, end: number) => Promise<ChunkData | null>,
  ): Promise<void> {
    const track = this.trackManager.getActiveTrack();
    if (!track) return;
    const chunk = await this.chunkLoader.loadChunk(currentTime, fetchChunk);
    if (chunk) {
      this.audioPlayer.appendAudioChunk(chunk);
    }
  }

  public setActiveTrack(track: ITrack, trackList?: ITrack[]): void {
    if (this.trackManager.getActiveTrack()?.id !== track.id) {
      this.audioPlayer.resetMediaSource();
      this.chunkLoader.reset();
    }
    this.trackManager.setActiveTrack(track, trackList);
  }

  public play(): void {
    console.log('play');
    console.log('this.audioPlayer.isAudioExist()', this.audioPlayer.isAudioExist());
    console.log('this.getLoadedTime() > 0', this.getLoadedTime() > 0);
    console.log('this.getLoadedTime()', this.getLoadedTime());
    if (this.audioPlayer.isAudioExist()) {
      this.audioPlayer.play();
      this.trackManager.play();
    }
  }

  public pause(): void {
    this.audioPlayer.pause();
    this.trackManager.pause();
  }

  public seekTo(time: number): void {
    if (time > this.chunkLoader.getLoadedTime()) {
      this.chunkLoader.reset();
    }
    this.audioPlayer.seekTo(time);
  }

  public setVolume(volume: number): void {
    this.audioPlayer.setVolume(volume);
  }

  public isPlayingState(): boolean {
    return this.trackManager.isPlayingState();
  }

  public getCurrentTime(): number {
    return this.audioPlayer.getCurrentTime();
  }

  public getLoadedTime(): number {
    return this.chunkLoader.getLoadedTime();
  }

  public getDuration(): number {
    return this.trackManager.getDuration();
  }

  public getAudio(): HTMLAudioElement | undefined {
    return this.audioPlayer.getAudio();
  }

  public isAudioExist(): boolean {
    return this.audioPlayer.isAudioExist();
  }

  public getChunkParams(chunkIndex: number): { start: number; end: number } {
    return this.chunkLoader.getChunkParams(chunkIndex);
  }

  public cleanup(): void {
    this.audioPlayer.cleanup();
    this.chunkLoader.reset();
    this.trackManager.clear();
  }

  public on<T extends PlayerEvent['type']>(event: T, listener: EventListener<T>): void {
    this.audioPlayer.on(`audio_${event}`, listener as (...args: unknown[]) => void);
    this.chunkLoader.on(`chunk_${event}`, listener as (...args: unknown[]) => void);
    this.trackManager.on(`track_${event}`, listener as (...args: unknown[]) => void);
  }

  public off<T extends PlayerEvent['type']>(event: T, listener: EventListener<T>): void {
    this.audioPlayer.off(`audio_${event}`, listener as (...args: unknown[]) => void);
    this.chunkLoader.off(`chunk_${event}`, listener as (...args: unknown[]) => void);
    this.trackManager.off(`track_${event}`, listener as (...args: unknown[]) => void);
  }

  public emit<T extends PlayerEvent['type']>(
    event: T,
    ...args: Extract<PlayerEvent, { type: T }>['args']
  ): void {
    this.audioPlayer.emit(`audio_${event}`, ...args);
    this.chunkLoader.emit(`chunk_${event}`, ...args);
    this.trackManager.emit(`track_${event}`, ...args);
  }
}

const playerManager = new PlayerManager();
export default playerManager;

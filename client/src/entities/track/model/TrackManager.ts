import { convertDurationToSeconds } from '@/shared/model';
import { ITrack } from '../types/Track';
import EventEmitter from 'eventemitter3';

export class TrackManager extends EventEmitter {
  private activeTrack: ITrack | null = null;
  private activeTrackList: ITrack[] | null = null;
  private isPlaying: boolean = false;

  public setActiveTrack(track: ITrack, trackList?: ITrack[]): void {
    this.activeTrack = track;
    this.activeTrackList = trackList || this.activeTrackList;
    this.isPlaying = true;
    this.emit('trackchange', track);
  }

  public handleTrackEnd(currentTime: number): void {
    if (this.activeTrack && this.activeTrackList && currentTime + 1 >= this.getDuration()) {
      const currentIndex = this.activeTrackList.findIndex((t) => t.id === this.activeTrack!.id);
      const nextIndex = (currentIndex + 1) % this.activeTrackList.length;
      const nextTrack = this.activeTrackList[nextIndex];
      this.setActiveTrack(nextTrack);
    }
  }

  public getActiveTrack(): ITrack | null {
    return this.activeTrack;
  }

  public isPlayingState(): boolean {
    return this.isPlaying;
  }

  public pause(): void {
    this.isPlaying = false;
    this.emit('pause');
  }

  public play(): void {
    this.isPlaying = true;
    this.emit('play');
  }

  public getDuration(): number {
    return this.activeTrack ? convertDurationToSeconds(this.activeTrack.duration) : 0;
  }

  public clear(): void {
    this.activeTrack = null;
    this.activeTrackList = null;
    this.isPlaying = false;
    this.emit('cleanup');
  }
}

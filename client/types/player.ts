import { ITrack } from "./track";

export interface PlayerState {
    activeTrack: null | ITrack;
    volume: number;
    duration: number;
    currentTime: number;
    pause: boolean;
    openedTrack: null | ITrack;
    activeTrackList: ITrack[];
    isOpenPlayerDetailed: boolean;
    defaultTrackList: ITrack[];
    openedTrackId: number,
    isOpenPlayerMobileDetailed:boolean
}

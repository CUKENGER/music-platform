import { ITrack } from "./track";

export interface PlayerState {
    activeTrack: null | ITrack;
    volume: number;
    duration: number;
    currentTime: number;
    pause: boolean;     
    active: boolean;
    openedTrack: null | ITrack
}

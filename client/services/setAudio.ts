import { ITrack } from "@/types/track";
import { baseUrl } from "./baseUrl";


export const setAudio = (audio: HTMLAudioElement | null, 
    activeTrack: ITrack | undefined, 
    volume: number, 
    playerSetDuration: Function, 
    playerPlay: Function, 
    playerSetCurrentTime: Function,
    trackList:ITrack[],
    playerSetActiveTrack:Function) => {
    if (activeTrack && audio) {
        if (audio.src !== baseUrl + activeTrack.audio) {
            audio.src = baseUrl + activeTrack.audio;
            audio.onloadedmetadata = () => {
                playerSetDuration(Math.ceil(audio.duration));
            };
            audio.onended = (event: Event) => {
                handleNextTrack(trackList, activeTrack, playerSetActiveTrack);
            };
            audio.oncanplay = () => {
                audio?.play();
                playerPlay();
            };
        }
        audio.volume = volume / 100;
        audio.ontimeupdate = () => {
            playerSetCurrentTime(Math.ceil(audio?.currentTime));
        };
    }
};

export const handleNextTrack = (trackList: ITrack[], 
    activeTrack: ITrack | undefined, 
    playerSetActiveTrack: Function) => {
    let nextTrackIndex = trackList.findIndex(t => t.id === activeTrack?.id) + 1;
    if (nextTrackIndex >= trackList.length) {
        nextTrackIndex = 0;
    }
    const nextTrack = trackList[nextTrackIndex];
    playerSetActiveTrack(nextTrack);
};

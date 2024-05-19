import { ITrack } from "@/types/track";
import { useCallback } from "react";


export const mixTracks = (tracks: ITrack[]): ITrack[] => {
    const mixed = [...tracks]
    for (let i = mixed.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mixed[i], mixed[j]] = [mixed[j], mixed[i]];
    }
    return mixed
}
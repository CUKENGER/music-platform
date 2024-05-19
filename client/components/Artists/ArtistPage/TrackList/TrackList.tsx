import { FC, memo, useEffect, useState } from "react";
import styles from './TrackList.module.css'
import { ITrack } from "@/types/track";
import useActions from "@/hooks/useActions";
import ArtistTrackItem from "./ArtistTrackItem/ArtistTrackItem";

interface TrackListProps{
    tracks: ITrack[]
}

const TrackList:FC<TrackListProps> = memo(({tracks}) => {

    const [trackList, setTrackList] = useState<ITrack[] | null>(null)
    const {setActiveTrackList} = useActions()

    useEffect(()=>{
        setTrackList(tracks)
        setActiveTrackList(tracks)
    }, [tracks])

    return (
        <div className={styles.container}>
            <div>
                <p>Треки</p>
            </div>
            {tracks && trackList && tracks.map((track, index) => (
                <ArtistTrackItem
                    key={track.id}
                    track={track}
                    trackIndex={index}
                    trackList={trackList}
                />
            ))}
        </div>
    )
})

export default TrackList
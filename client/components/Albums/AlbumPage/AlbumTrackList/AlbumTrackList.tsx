import styles from './AlbumTrackList.module.css'
import {FC, useEffect, useState} from "react";
import {ITrack} from "@/types/track";
import AlbumTrackItem from "@/components/Albums/AlbumPage/AlbumTrackList/AlbumTrackItem/AlbumTrackItem";
import useActions from '@/hooks/useActions';

interface AlbumTrackListProps {
    tracks: ITrack[]
}

const AlbumTrackList:FC<AlbumTrackListProps> = ({tracks}) => {

    const [trackList, setTrackList] = useState<ITrack[] | null>(null)
    const {setActiveTrackList} = useActions()

    useEffect(()=>{
        setTrackList(tracks)
        setActiveTrackList(tracks)
    }, [tracks])

    return (
        <div className={styles.container}>
            {tracks && trackList && tracks.map((track, index)=>(
                <AlbumTrackItem 
                    track={track} 
                    key={track?.id} 
                    trackIndex={index} 
                    trackList={trackList}
                />
            ))}
        </div>
    )
}

export default AlbumTrackList
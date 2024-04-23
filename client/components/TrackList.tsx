import { ITrack } from "@/types/track"
import { FC } from "react"
import styles from '@/styles/TrackList.module.css'
import TrackItem from "./TrackItem"


interface TrackListProps {
    tracks: ITrack[] | undefined
}

const TrackList: FC<TrackListProps> = ({tracks}) => {
    return (
        <div className={styles.container}>
            {tracks && tracks.map(track => (
                <TrackItem key={track?.id} track={track}/>
            ))}
        </div>
    )
}

export default TrackList
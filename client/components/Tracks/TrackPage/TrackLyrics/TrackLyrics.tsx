import { FC, memo } from "react";
import styles from './TrackLyrics.module.css'
import { ITrack } from "@/types/track";

interface TrackLyricsProps{
    openedTrack: ITrack
}

const TrackLyrics:FC<TrackLyricsProps> = memo(({openedTrack}) => {
    console.log(openedTrack);
    return (
        <div className={styles.container}>
            <div className={styles.title_container}>
                <p className={styles.title}>
                    Текст песни
                </p>
                
            </div>
            
            {openedTrack?.text
            ? (
                <p className={styles.lyrics + ' ' + styles.lyrics_hide}>
                    {openedTrack.text}
                </p>
            ) : ('')
            }
                    

        </div>
    )
})

export default TrackLyrics
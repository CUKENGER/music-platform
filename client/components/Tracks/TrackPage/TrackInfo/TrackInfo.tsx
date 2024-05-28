import { baseUrl } from '@/services/baseUrl'
import styles from './TrackInfo.module.css'
import { ITrack } from '@/types/track'
import { FC } from 'react'

interface TrackInfoProps{
    openedTrack: ITrack
}

const TrackInfo:FC<TrackInfoProps> = ({openedTrack}) => {
    return (
        <div className={styles.container}>
            <div className={styles.cover_container}>

                <img
                    src={baseUrl + openedTrack?.picture} 
                    className={styles.cover}
                    alt="cover icon"
                />
            </div>

            <div className={styles.info}>
                <div className={styles.info_item_container}>
                    <p className={styles.category}>Исполнитель</p>
                    <p className={styles.artist}>{openedTrack?.artist}</p>
                </div>
                <div className={styles.info_item_container}>
                    <p className={styles.category}>Название</p>
                    <p className={styles.artist}>{openedTrack?.name}</p>
                </div>
                <div className={styles.info_item_container}>
                    <p className={styles.category}>Прослушиваний</p>
                    <p className={styles.artist}>{openedTrack?.listens}</p>
                </div>
            </div>
        </div>
    )
}

export default TrackInfo
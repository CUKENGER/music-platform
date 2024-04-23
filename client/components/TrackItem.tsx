import { FC, useEffect} from "react"
import pause_icon from '@/assets/pause.svg'
import play_icon from '@/assets/play.svg'
import delete_icon from '@/assets/delete.svg'
import Image from 'next/image'
import styles from '@/styles/TrackItem.module.css'
import { ITrack } from "@/types/track";
import { useRouter } from "next/router"
import useActions from "@/hooks/useActions"
import { useTypedSelector } from "@/hooks/useTypedSelector"
import { baseUrl } from "@/services/baseUrl"
import audioManager from "@/services/AudioManager"
import { useDeleteTrackMutation } from "@/services/TrackService"

interface TrackItemProps {
    track: ITrack;
}

const TrackItem:FC<TrackItemProps> = ({track}) => {

    const router = useRouter()

    const audio = audioManager.audio

    const {activeTrack, pause, volume, currentTime, duration} = useTypedSelector(state => state.playerReducer)
    const {playerPlay, playerSetActiveTrack, playerPause, playerSetDuration, playerSetCurrentTime, setOpenedTrack} = useActions()

    const [deleteTrackMutation] = useDeleteTrackMutation()

    console.log(track)

    const getListenWordForm = (count: number): string => {
        let remainder10 = count % 10;
        let remainder100 = count % 100;
    
        if (remainder10 === 1 && remainder100 !== 11) {
            return 'прослушивание';
        } else if (remainder10 >= 2 && remainder10 <= 4 && (remainder100 < 10 || remainder100 >= 20)) {
            return 'прослушивания';
        } else {
            return 'прослушиваний';
        }
    }

    const setAudio = () => {
        if (activeTrack && audio) {
            audio.src = baseUrl + activeTrack.audio;
            audio.volume = volume / 100;
            audio.onloadedmetadata = () => {
                playerSetDuration(Math.ceil(audio.duration));
            };
            audio.oncanplay = () => {
                if (!pause) {
                    audio?.play();
                    playerPlay();
                }
            };
            audio.ontimeupdate = () => {
                playerSetCurrentTime(Math.ceil(audio?.currentTime));
            };
        } else {
            console.log('Нужно выбрать трек или все сломалось');
        }
    };

    useEffect(() => {
        setAudio();
    }, [activeTrack]);

    const playBtn = async () => {
        await playerSetActiveTrack(track)
        if (pause) {
            await audio?.play();
            await playerPlay();
        } else {
            await audio?.pause();
            await playerPause();
        }
    }

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${secondsStr}`;
    };

    const handleDelete = async () => {
        await deleteTrackMutation(track?.id)
    }

    const handleTrackClick = () => {
        router.push('/tracks/' + track.id)
        setOpenedTrack(track)
    }

    const trackPicture = baseUrl + track.picture

    return (
        <div className={styles.track__container}>
            <div className={styles.main__info_container}>
                <Image onClick={playBtn} className={styles.playBtn} width={40} height={40} src={!pause && activeTrack?.name === track.name ? pause_icon : play_icon} alt='pause btn icon'/>
                <img onClick={handleTrackClick} className={styles.cover} width={45} height={45} src={trackPicture} alt='cover'/>
                <div className={styles.info__track_container}>
                    <p onClick={handleTrackClick} className={styles.name}>{track.name}</p>
                    <p className={styles.artist}>{track.artist} <span className={styles.listens}>{track.listens} {getListenWordForm(track.listens)}</span></p>
                </div>
            </div>
            <div className={styles.right__container}>

                <div className={styles.time__container}>
                    
                    {activeTrack?.name == track.name && (<p className={styles.time}>{formatTime(currentTime)} / {formatTime(duration)}</p>)}
                </div>
                <Image 
                width={40} 
                height={40} 
                onClick={handleDelete}
                className={styles.delete_icon} 
                src={delete_icon} 
                alt="delete icon"
                />
            </div>
        </div>
    )
}

export default TrackItem;
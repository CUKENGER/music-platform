import { ChangeEvent, FC } from "react";
import styles from '@/styles/TrackProgress.module.css'
import volumeIcon from '@/assets/volume.svg'
import Image from 'next/image'
import { useTypedSelector } from "@/hooks/useTypedSelector";
import useActions from "@/hooks/useActions";
import audioManager from "@/services/AudioManager";

interface TrackProgressProps {
    isVolume?: boolean;
}

const TrackProgress:FC<TrackProgressProps> = ({isVolume = true}) => {

    const audio = audioManager.audio

    const {volume, duration, currentTime} = useTypedSelector(state => state.playerReducer)
    const {playerSetVolume, playerSetCurrentTime} = useActions()

    const changeVolume = (e: ChangeEvent<HTMLInputElement>) => {
        if (audio) {
            audio.volume = Number(e.target.value) / 100;
            playerSetVolume(Number(e.target.value));
        }
    };

    const changeCurrentTime = (e: ChangeEvent<HTMLInputElement>) => {
        if (audio) {
            audio.currentTime = Number(e.target.value);
            playerSetCurrentTime(Number(e.target.value));
        }
    };


    return (
        <>
            {isVolume 
            ? (
                <div className={styles.input_volume_container}>
                    <Image 
                        className={styles.volume_icon} 
                        src={volumeIcon} 
                        alt='volume Icon'
                    />
                    <input 
                        type="range" 
                        min={0}
                        max={100}
                        value={volume}
                        onChange={changeVolume}
                        className={styles.input_volume} 
                        style={{ '--value': `${(volume / 100) * 100}%` } as any}
                    />
                </div>
            )
            : (
            <div className={styles.input_duration_container}>
                <input 
                    type="range" 
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={changeCurrentTime}
                    className={styles.input_duration} 
                    style={{ '--value': `${(currentTime / duration) * 100}%` } as any}
                />
            </div>
            )}
            
    
            
        </>
    )
}

export default TrackProgress
'use client'

import styles from '@/styles/Player.module.css';
import play_icon from '@/assets/playDark.svg';
import pause_icon from '@/assets/pauseDark.svg';
import Image from 'next/image'
import TrackProgress from './TrackProgress';
import volume_icon from '@/assets/volume.svg'
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import useActions from '@/hooks/useActions';
import audioManager from '@/services/AudioManager';
import { useAddListenMutation } from '@/services/TrackService';
import { useRouter } from 'next/router';

const Player: FC = () => {

    const audio = audioManager.audio

    const {activeTrack, currentTime, duration, pause, volume,openedTrack} = useTypedSelector(state => state.playerReducer)
    const {playerSetCurrentTime, playerSetVolume, playerPlay, playerPause,setOpenedTrack} = useActions()

    const [addListenMutation] = useAddListenMutation()

    const [hasListen, setHasListen] = useState(false);

    const router = useRouter()

    useEffect(() => {
        if (currentTime >= 30 && !hasListen && activeTrack) {
            addListenMutation(activeTrack?.id)
            setHasListen(true)
        }
    }, [currentTime, hasListen, activeTrack])


    const playBtn = async () => {
        if (pause) {
            await audio?.play();
            await playerPlay();
        } else {
            await audio?.pause();
            await playerPause();
        }
    }

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

    if (!activeTrack) {
        return null
    }

    const handleTrackClick = () => {
        router.push('/tracks/' + activeTrack?.id)
        setOpenedTrack(activeTrack)
    }

    return (
        <div className={styles.container}>
            <div className={styles.main_info_container}>
                <div onClick={playBtn}>
                    <Image width={40} height={40} className={styles.pause_btn} src={!pause ? pause_icon : play_icon} alt='pause btn icon'/>
                </div>
                <div className={styles.info_container}>
                        <p 
                        onClick={handleTrackClick}
                        className={styles.name}
                        >{activeTrack?.name}
                        </p>
                        <p className={styles.artist}>{activeTrack?.artist}</p>
                </div>
            </div>

            <div className={styles.duration_container}>

                <TrackProgress left={currentTime} right={duration}
                onChange={changeCurrentTime}
                isVolume={false}
                />
            </div>

             <div className={styles.volume_container}>
                <Image width={40} height={40} src={volume_icon} alt='volume icon'/>
                <TrackProgress left={volume} right={100} 
                onChange={changeVolume}
                isVolume={true}
                />
             </div>
        </div>
    )
}

export default Player


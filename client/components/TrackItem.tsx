import { FC, useEffect, useMemo} from "react"
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
import PlaybackBtn from "./PlaybackBtn"
import React from "react";

interface TrackItemProps {
    track: ITrack;
    trackList: ITrack[];
}

const TrackItem:FC<TrackItemProps> = React.memo(({track, trackList}) => {
    const router = useRouter()

    const audio = audioManager.audio

    const {activeTrack, pause, volume, currentTime, duration} = useTypedSelector(state => state.playerReducer)
    const {playerPlay, 
        playerSetActiveTrack,
        playerSetDuration, 
        playerSetCurrentTime, 
        setOpenedTrack} = useActions()

    const [deleteTrackMutation] = useDeleteTrackMutation()

    const setAudio = () => {
        if (activeTrack && audio) {
            audio.src = baseUrl + activeTrack.audio;
            audio.volume = volume / 100;
            audio.onloadedmetadata = () => {
                playerSetDuration(Math.ceil(audio.duration));
            };
            audio.onended = handleNextTrack;
            audio.oncanplay = () => {
                if (!pause) {
                    audio?.play();
                    playerPlay();
                }
            };
            audio.ontimeupdate = () => {
                playerSetCurrentTime(Math.ceil(audio?.currentTime));
            };
            
        }
    };

    // useMemo()
    useEffect(() => {
        setAudio();
    }, [activeTrack]);

    const handleNextTrack = useMemo(() => async () => {
        let nextTrackIndex = trackList.findIndex(t => t.id === activeTrack?.id) + 1;
        if (nextTrackIndex >= trackList.length) {
            nextTrackIndex = 0;
        }
        const nextTrack = trackList[nextTrackIndex];
        await playerSetActiveTrack(nextTrack);
    }, [trackList, activeTrack, playerSetActiveTrack]);

    const handleDelete = async () => {
        await deleteTrackMutation(track?.id)
    }

    const handleTrackClick = () => {
        router.push('/tracks/' + track.id)
        setOpenedTrack(track)
    }

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${secondsStr}`;
    };

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

    const trackPicture = baseUrl + track.picture

    return (
        <div className={styles.track__container}>
            <div className={styles.main__info_container}>
                <PlaybackBtn track={track} isPlayer={false}/>
                <img 
                    onClick={handleTrackClick} 
                    className={styles.cover} 
                    width={45} 
                    height={45} 
                    src={trackPicture} 
                    alt='cover'
                />
                <div className={styles.info__track_container}>
                    <p onClick={handleTrackClick} className={styles.name}>
                        {track.name}
                    </p>
                    <p className={styles.artist}>
                        {track.artist} 
                        <span className={styles.listens}>
                            {track.listens} {getListenWordForm(track.listens)}
                        </span>
                    </p>
                </div>
            </div>
            <div className={styles.right__container}>
                <div className={styles.time__container}>
                    {activeTrack?.name == track.name && 
                    (
                    <p className={styles.time}>
                        <span className={styles.time_desktop}>
                            {formatTime(currentTime)} /
                        </span> 
                        {formatTime(duration)}
                    </p>
                    )}
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
})

export default TrackItem;
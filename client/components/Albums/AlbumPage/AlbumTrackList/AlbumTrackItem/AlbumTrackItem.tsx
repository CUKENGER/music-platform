import styles from './AlbumTrackItem.module.css'
import Image from 'next/image'
import {ITrack} from "@/types/track";
import {FC, useEffect, useState} from "react";
import { baseUrl } from '@/services/baseUrl';
import play_icon from '@/assets/play_icon.png'
import audioManager from '@/services/AudioManager';
import useActions from '@/hooks/useActions';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { setAudio } from '@/services/setAudio';
import pause_icon from '@/assets/pause_icon.png'
import MusicWaves from "@/UI/MusicWaves/MusicWaves";
import { playerActions } from '@/store/reducers/playerReducer';

interface AlbumTrackItemProps{
    track: ITrack;
    trackIndex: number;
    trackList:ITrack[];
}

const AlbumTrackItem:FC<AlbumTrackItemProps> = ({track, trackIndex, trackList}) => {
    const [showPlayIcon, setShowPlayIcon] = useState(false)
    const [durationTrack, setDurationTrack] = useState<string>(''); // Состояние для хранения длительности трека
    const {activeTrack, pause, volume} = useTypedSelector(state => state.playerReducer)
    const {playerPlay, 
        playerPause,
        playerSetActiveTrack,
        playerSetDuration,
        playerSetCurrentTime,
        setDefaultTrackList
    } = useActions()

    const audio = audioManager.audio

    useEffect(() => {
        const audio = new Audio(baseUrl + track?.audio);

        const handleLoadedMetadata = () => {
            const minutes = Math.floor(audio.duration / 60);
            const seconds = Math.floor(audio.duration % 60);
            const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            setDurationTrack(formattedDuration);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [track]);

    useEffect(() => {
        if (activeTrack !== track) {
            if(audio && activeTrack) {
                setAudio(audio, activeTrack, volume, playerSetDuration, playerPlay, playerSetCurrentTime, trackList, playerSetActiveTrack);
            }
        }
    }, [activeTrack, audio, playerPlay, playerSetActiveTrack, playerSetCurrentTime, playerSetDuration, track, trackList, volume]); 

    const handlePlay = async () => {
        setDefaultTrackList(trackList)
        playerSetActiveTrack(track)
        if (pause) {
            await audio?.play();
            playerPlay();
        } else {
            audio?.pause();
            playerPause();
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.name_container}>
                <p className={styles.index}>{trackIndex + 1}</p>
                <div 
                    className={styles.cover_container}
                    onMouseEnter={() => setShowPlayIcon(true)}
                    onMouseLeave={() => setShowPlayIcon(false)}
                >
                    <img 
                        className={activeTrack?.name == track.name ? styles.cover_active : styles.cover}
                        src={baseUrl + track?.picture} 
                        alt='cover icon'
                    />
                    {showPlayIcon && (
                        <div className={showPlayIcon ? styles.play_icon : styles.play_icon_disabled}>
                            <Image 
                                src={!pause ? pause_icon : play_icon}
                                alt="play icon"
                                onClick={handlePlay}
                            />
                        </div>
                    )}
                    {activeTrack?.name == track.name && !showPlayIcon && (
                        <MusicWaves/>
                    )
                    }

                </div>
                <p className={styles.name}>{track?.name}</p>
                <p className={styles.artist}>{track?.artist}</p>
            </div>
            <div className={styles.plays_container}>
                {track?.listens ? track?.listens : 0}
            </div>
            <div className={styles.duration_container}>
                <p>{durationTrack}</p>
            </div>
        </div>
    );
};

export default AlbumTrackItem;
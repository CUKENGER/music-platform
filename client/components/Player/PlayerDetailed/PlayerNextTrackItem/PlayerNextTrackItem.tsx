import styles from './PlayerNextTrackItem.module.css';
import Image from 'next/image';
import { ITrack } from "@/types/track";
import { DragEvent, FC, memo, useEffect, useState } from "react";
import { baseUrl } from '@/services/baseUrl';
import play_icon from '@/assets/play_icon.png';
import audioManager from '@/services/AudioManager';
import useActions from '@/hooks/useActions';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import pause_icon from '@/assets/pause_icon.png';
import MusicWaves from "@/UI/MusicWaves/MusicWaves";

interface PlayerNextTrackItemProps {
    track: ITrack;
    onDrop: (draggedTrack: ITrack, droppedTrack: ITrack) => void;
    setCurrentDraggedTrack: (track: ITrack | null) => void;
    currentDraggedTrack: ITrack | null;
}

const PlayerNextTrackItem: FC<PlayerNextTrackItemProps> = ({ track, onDrop, setCurrentDraggedTrack, currentDraggedTrack }) => {
    const [showPlayIcon, setShowPlayIcon] = useState(false);
    const [durationTrack, setDurationTrack] = useState<string>(''); 
    const { activeTrack, pause } = useTypedSelector(state => state.playerReducer);
    const { playerPlay, playerPause, playerSetActiveTrack, playerSetDuration, playerSetCurrentTime } = useActions();
    const audio = audioManager.audio;

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

    const handlePlay = async () => {
        playerSetActiveTrack(track);
        if (pause) {
            await audio?.play();
            playerPlay();
        } else {
            audio?.pause();
            playerPause();
        }
    };

    const dragStartHandler = (e: DragEvent<HTMLDivElement>, track: ITrack) => {
        setCurrentDraggedTrack(track);
        e.currentTarget.classList.add(styles.dragging);
    };

    const dragEndHandler = (e: DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove(styles.dragging);
    };

    const dragOverHandler = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.add(styles.drag_over);
    };

    const dragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove(styles.drag_over);
    };

    const dropHandler = (e: DragEvent<HTMLDivElement>, track: ITrack) => {
        e.preventDefault();
        e.currentTarget.classList.remove(styles.drag_over);
        if (currentDraggedTrack) {
            onDrop(currentDraggedTrack, track);
            setCurrentDraggedTrack(null);
        }
    };

    return (
        <div
            onDragStart={(e) => dragStartHandler(e, track)}
            onDragLeave={dragLeaveHandler}
            onDragEnd={dragEndHandler}
            onDragOver={dragOverHandler}
            onDrop={(e) => dropHandler(e, track)}
            draggable={true}
            className={styles.container}
        >
            <div className={styles.name_container}>
                <div 
                    className={styles.cover_container}
                    onMouseEnter={() => setShowPlayIcon(true)}
                    onMouseLeave={() => setShowPlayIcon(false)}
                >
                    <img 
                        className={activeTrack?.name === track.name ? styles.cover_active : styles.cover}
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
                    {activeTrack?.name === track.name && !showPlayIcon && (
                        <MusicWaves/>
                    )}
                </div>
                <div className={styles.artist_name_container}>
                    <p className={styles.name}>{track?.name}</p>
                    <p className={styles.artist}>{track?.artist}</p>
                </div>
            </div>
            <div className={styles.duration_container}>
                <p>{track?.duration}</p>
            </div>
        </div>
    );
};

export default memo(PlayerNextTrackItem);

import styles from './PlayerNextTrackItem.module.css';
import Image from 'next/image';
import { ITrack } from "@/types/track";
import {ChangeEvent, FC, memo,useRef,useState } from "react";
import { baseUrl } from '@/services/baseUrl';
import play_icon from '@/assets/play_icon.png';
import audioManager from '@/services/AudioManager';
import useActions from '@/hooks/useActions';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import pause_icon from '@/assets/pause_icon.png';
import MusicWaves from "@/UI/MusicWaves/MusicWaves";
import { Reorder } from 'framer-motion';
import miniMenu_icon from '@/assets/miniMenu.png'
import Portal from '@/components/Portal/Portal';
import TrackMenu from '@/UI/TrackMenu/TrackMenu';

interface PlayerNextTrackItemProps {
    track: ITrack;
    isMenuOpen: boolean;
    pressedTrack: number | null;
    handleOpenMenu: (id: number) => void
}

const PlayerNextTrackItem: FC<PlayerNextTrackItemProps> = ({ track, isMenuOpen, pressedTrack, handleOpenMenu}) => {
    const [showPlayIcon, setShowPlayIcon] = useState(false);
    const [isShowMenuBtn, setIsShowMenuBtn] = useState(false)

    const menuRef = useRef<HTMLDivElement>(null);

    const { activeTrack, pause } = useTypedSelector(state => state.playerReducer);
    const { playerPlay, playerPause, playerSetActiveTrack, playerSetDuration, playerSetCurrentTime } = useActions();
    const audio = audioManager.audio;

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

    return (
        <Reorder.Item
            value={track}
            className={styles.reorder_item}
            whileDrag={{
                border: '2px solid var(--pmr)',
                borderRadius: '10px'
            }}
        >
            <div
                className={styles.container}
                onMouseEnter={() => setIsShowMenuBtn(true)}
                onMouseLeave={() => setIsShowMenuBtn(false)}
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
                {isShowMenuBtn 
                ? (
                    <div className={styles.menu_icon_container}>
                        <Image 
                            className={styles.menu_icon_btn}
                            src={miniMenu_icon} 
                            alt='menu icon'
                            onClick={() => handleOpenMenu(track.id)}
                        />
                        
                    </div>
                ) 
                : (
                    <div className={styles.duration_container}>
                        <p className={styles.duration}>{track?.duration}</p>
                    </div>
                )
                }
                {isMenuOpen && pressedTrack === track.id && (
                    <TrackMenu
                        trackId={track.id}
                    />
                )}
                
            </div>
        </Reorder.Item>
    );
};

export default memo(PlayerNextTrackItem);

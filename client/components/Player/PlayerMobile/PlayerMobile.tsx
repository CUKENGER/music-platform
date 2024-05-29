import styles from './PlayerMobile.module.css';
import {memo } from 'react';
import Image from 'next/image'
import TrackProgress from '../TrackProgress/TrackProgress';
import SwitchTracksBtn from '../SwitchTracksBtn/SwitchTracksBtn';
import PlayPauseBtns from "@/UI/PlayPauseBtns/PlayPauseBtns";
import openPlayer_icon from '@/assets/openMusicPlayer_icon.png'
import like from '@/assets/like.png'
import like_fill from '@/assets/like_fill.png'
import mix_icon_active from '@/assets/mix_icon_active.png'
import mix_icon_inactive from '@/assets/mix_icon_inactive.png'
import { usePlayer } from '@/hooks/player/usePlayer';

const PlayerMobile = () => {

    const {
        activeTrack,
        pause,
        currentTime,
        duration,
        isLike,
        likes,
        isMix,
        isOpenPlayerDetailed,
        handleTrackClick,
        playBtn,
        handleOpenPlayer,
        handleLike,
        handleMix,
    } = usePlayer()

    if (!activeTrack) {
        return null
    }

    return (
        <div className={styles.main_container}>
            <TrackProgress isVolume={false}/>
            <div className={styles.bottom_container}>
                <div className={styles.general_name_container}>
                    <div className={styles.name_container}>
                        <p className={styles.name} onClick={handleTrackClick}>
                            {activeTrack?.name}
                        </p>
                        <p className={styles.artist}>
                            {activeTrack?.artist}
                        </p>
                    </div>
                    <div className={styles.duration_container}>
                        <p className={styles.duration_text}>1:23 / 2:33 {duration}</p>
                    </div>
                    <div className={styles.like_container} onClick={handleLike}>
                        <Image 
                            className={styles.like} 
                            src={isLike ? like_fill : like} 
                            alt='like icon'
                        />
                        <p className={styles.like_count}>
                            {likes}
                        </p>
                    </div>

                </div>

                <div className={styles.playerBtns_container}>
                    <SwitchTracksBtn isNextBtn={false}/>
                    <PlayPauseBtns onClick={playBtn} pause={pause}/>
                    <SwitchTracksBtn/>
                </div>
                <div onClick={handleMix} className={styles.mix_icon_container}>
                    <Image 
                        src={isMix ? mix_icon_active : mix_icon_inactive} 
                        alt='mix icon'
                    />
                </div>
                <TrackProgress/>
                <div onClick={handleOpenPlayer} className={styles.openPlayer_icon_container}>
                    <Image
                        className={isOpenPlayerDetailed ? styles.openPlayer_icon_down : styles.openPlayer_icon}
                        loading='eager'
                        quality={100}
                        src={openPlayer_icon}
                        alt='open player icon'
                    />
                </div>
            </div>

        </div>
    )
}

export default memo(PlayerMobile)
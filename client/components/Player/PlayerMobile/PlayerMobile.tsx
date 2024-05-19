import styles from './PlayerMobile.module.css';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import useActions from '@/hooks/useActions';
import {useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import audioManager from '@/services/AudioManager';
import Image from 'next/image'
import { useAddListenMutation } from '@/api/TrackService';
import TrackProgress from '../TrackProgress/TrackProgress';
import SwitchTracksBtn from '../SwitchTracksBtn/SwitchTracksBtn';
import PlayPauseBtns from "@/UI/PlayPauseBtns/PlayPauseBtns";
import openPlayer_icon from '@/assets/openMusicPlayer_icon.png'
import like from '@/assets/like.png'
import like_fill from '@/assets/like_fill.png'
import Btn from '@/UI/Btn/Btn';
import { mixTracks } from '@/services/MixPlaylist';


const PlayerMobile = () => {

    const router = useRouter()

    const [isLike, setIsLike] = useState(false)
    const [likes, setLikes] = useState(0)
    const audio = audioManager.audio
    const [hasListen, setHasListen] = useState(false);

    const {activeTrack,
        pause,
        currentTime,
        isOpenPlayerDetailed,
        activeTrackList} = useTypedSelector(state => state.playerReducer)
    const {setOpenedTrack,
        playerPlay,
        playerPause,
        setIsOpenPlayerDetailed,
        setActiveTrackList} = useActions()

    const [addListenMutation] = useAddListenMutation()

    useEffect(() => {
        if (currentTime >= 30 && !hasListen && activeTrack) {
            if(activeTrack?.id) {
                addListenMutation(activeTrack?.id)
                setHasListen(true)
            }
        }
    }, [currentTime, hasListen, activeTrack])

    if (!activeTrack) {
        return null
    }

    const handleTrackClick = () => {
        router.push('/tracks/' + activeTrack?.id)
        setOpenedTrack(activeTrack)
    }

    const playBtn = async () => {
        if (pause) {
            await audio?.play();
            playerPlay();
        } else {
            audio?.pause();
            playerPause();
        }
    }

    const handleOpenPlayer = () =>{
        setIsOpenPlayerDetailed(!isOpenPlayerDetailed)
    }

    const handleLike = () => {
        if(isLike) {
            setLikes(likes - 1)
            setIsLike(!isLike)
        } else {
            setLikes(likes + 1)
            setIsLike(!isLike)
        }
    }

    const handleMix = () => {
        setActiveTrackList(mixTracks(activeTrackList))
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
                    <div className={styles.like_container} onClick={handleLike}>
                        <Image className={styles.like} src={isLike ? like_fill : like} alt='like icon'/>
                        <p className={styles.like_count}>{likes}</p>
                    </div>

                </div>

                <div className={styles.playerBtns_container}>
                    <SwitchTracksBtn isNextBtn={false}/>
                    <PlayPauseBtns onClick={playBtn} pause={pause}/>
                    <SwitchTracksBtn/>
                </div>
                <div className={styles.mixBtn_container}>
                    <Btn onClick={handleMix}>Перемешать</Btn>
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

export default PlayerMobile
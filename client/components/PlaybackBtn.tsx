import Image from 'next/image'
import pause_icon from '@/assets/pause.svg'
import play_icon from '@/assets/play.svg'
import styles from '@/styles/PlaybackBtn.module.css'
import { ITrack } from '@/types/track'
import useActions from '@/hooks/useActions';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import audioManager from '@/services/AudioManager';
import { FC, NonDirectionalSuspenseListProps } from 'react';
import playBtnIcon from '@/assets/playDark.svg'
import pauseBtnicon from '@/assets/pauseDark.svg';

interface PlaybackBtnProps {
    track?: ITrack | null;
    isPlayer?: boolean
}

const PlaybackBtn: FC<PlaybackBtnProps> = ({track, isPlayer=true}) => {

    const audio = audioManager.audio

    const {playerSetActiveTrack, playerPlay, playerPause} = useActions()
    const {pause, activeTrack} = useTypedSelector(state=> state.playerReducer)

    const playBtn = async () => {
        if (!isPlayer){
            if(track){
                await playerSetActiveTrack(track)
            }
        }
        
        if (pause) {
            await audio?.play();
            await playerPlay();
        } else {
            await audio?.pause();
            await playerPause();
        }
    }

    return (
        <>
            {isPlayer 
                ? (
                    <Image 
                        onClick={playBtn} 
                        className={styles.playBtnPlayer} 
                        src={!pause ? pauseBtnicon : playBtnIcon} 
                        alt='playBtnPlayer'
                    />
                )
                : (
                    <Image
                        onClick={playBtn} 
                        className={styles.playBtn} 
                        width={40} 
                        height={40}
                        src={!pause && activeTrack?.name === track?.name ? pause_icon : play_icon} 
                        alt='pause btn icon'
                    />)}
        </>
        
    )
}

export default PlaybackBtn;

import styles from '@/styles/SwitchTracksBtn.module.css'
import { FC } from 'react';
import Image from 'next/image'
import nextBtn from '@/assets/nextBtnPlayer.svg'
import prevBtn from '@/assets/prevBtnPlayer.svg'
import { useTypedSelector } from '@/hooks/useTypedSelector';
import useActions from '@/hooks/useActions';

interface SwitchTracksBtnProps {
    isNextBtn?: boolean
}

const SwitchTracksBtn:FC<SwitchTracksBtnProps> = ({isNextBtn=true}) => {

    const {activeTrackList, activeTrack} = useTypedSelector(state=> state.playerReducer)
    const {playerSetActiveTrack} = useActions()

    const handleBtn = () => {
        const tracks = activeTrackList;
        if (tracks) {
            const currentIndex = tracks.findIndex(track => track.id === activeTrack?.id);
            let nextIndex;
            if (isNextBtn) {
                nextIndex = (currentIndex + 1) % tracks.length;
            } else {
                nextIndex = (currentIndex - 1 + tracks.length) % tracks.length;
            }
            const nextTrack = tracks[nextIndex];
            if (nextTrack) {
                playerSetActiveTrack(nextTrack);
            }
        }
    }

    return(
        <>
            {isNextBtn 
                ? (
                    <Image 
                        onClick={handleBtn}
                        className={styles.nextBtnPlayer} 
                        src={nextBtn} 
                        alt='nextBtnPlayer'
                    />
                )
                : (
                    <Image
                        onClick={handleBtn}
                        className={styles.prevBtnPlayer} 
                        src={prevBtn} 
                        alt='prevBtnPlayer'
                    />
                )
            }
        </>
        
    )
}

export default SwitchTracksBtn;
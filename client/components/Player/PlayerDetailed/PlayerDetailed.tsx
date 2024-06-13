import styles from './PlayerDetailed.module.css'
import {useTypedSelector} from "@/hooks/useTypedSelector";
import {baseUrl} from "@/services/baseUrl";
import { ChangeEvent, memo, useMemo, useState } from 'react';
import PlayerNextTrackItem from './PlayerNextTrackItem/PlayerNextTrackItem';
import { ITrack } from '@/types/track';
import useActions from '@/hooks/useActions';
import PlayerNavbar from './PlayerNavbar/PlayerNavbar';
import { Reorder } from 'framer-motion';

const PlayerDetailed = () => {
    
    const {activeTrack, activeTrackList} = useTypedSelector(state => state.playerReducer)
    const [isPressNext, setIsPressNext] = useState(false)
    const [isPressText, setIsPressText] = useState(true)
    const {setActiveTrackList} = useActions()

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [pressedTrack, setPressedTrack] = useState<number | null>(null)
    const [menuPosition, setMenuPosition] = useState<{x:number,y: number} | null>(null)

    const reorderedTrackList = useMemo(() => {
        if (!activeTrack) return activeTrackList;
        const startIndex = activeTrackList.findIndex(track => track.id === activeTrack.id);
        if (startIndex === -1) return activeTrackList;
        return [...activeTrackList.slice(startIndex), ...activeTrackList.slice(0, startIndex)];
    }, [activeTrack, activeTrackList]);

    const handleOpenMenu = (id: number) => {
        if (pressedTrack === id) {
            setIsMenuOpen(!isMenuOpen);
            setPressedTrack(null)
        } else {
            setIsMenuOpen(true);
            setPressedTrack(id);
        }

    };
     
    return (
        <div className={styles.container}>
            <div className={styles.cover_container}>
                <img
                    className={styles.cover}
                    src={baseUrl + activeTrack?.picture}
                    alt='cover icon'
                />
            </div>
            <div className={styles.right_container}>
                <PlayerNavbar
                    setIsPressNext={setIsPressNext}
                    setIsPressText={setIsPressText}
                    isPressNext={isPressNext}
                    isPressText={isPressText}
                />
                {isPressText && (
                    <div className={styles.text_container}>
                        <p className={styles.text}>{activeTrack?.text}</p>
                    </div>
                )}
                
                <div className={styles.nextTracks_container}>
                    {isPressNext && (
                        <Reorder.Group
                            axis='y'
                            values={reorderedTrackList}
                            onReorder={(newValues) => setActiveTrackList(newValues)}
                        >
                            {
                                reorderedTrackList.map((track, index)=> (
                                    
                                    <PlayerNextTrackItem
                                        key={track.id}
                                        track={track}
                                        isMenuOpen={isMenuOpen}
                                        handleOpenMenu={handleOpenMenu}
                                        pressedTrack={pressedTrack}
                                    />
                                ))
                            }
                        </Reorder.Group>
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(PlayerDetailed);
import styles from './PlayerDetailed.module.css'
import {useTypedSelector} from "@/hooks/useTypedSelector";
import {baseUrl} from "@/services/baseUrl";
import { memo, useMemo, useState } from 'react';
import PlayerNextTrackItem from './PlayerNextTrackItem/PlayerNextTrackItem';
import { ITrack } from '@/types/track';
import useActions from '@/hooks/useActions';
import PlayerNavbar from './PlayerNavbar/PlayerNavbar';

const PlayerDetailed = () => {
    
    const {activeTrack, activeTrackList} = useTypedSelector(state => state.playerReducer)
    const [isPressNext, setIsPressNext] = useState(false)
    const [isPressText, setIsPressText] = useState(true)
    const [currentDraggedTrack, setCurrentDraggedTrack] = useState<ITrack | null>(null);
    const {setActiveTrackList} = useActions()

    const reorderedTrackList = useMemo(() => {
        if (!activeTrack) return activeTrackList;
        const startIndex = activeTrackList.findIndex(track => track.id === activeTrack.id);
        if (startIndex === -1) return activeTrackList;
        return [...activeTrackList.slice(startIndex), ...activeTrackList.slice(0, startIndex)];
    }, [activeTrack, activeTrackList]);

    const handleDrop = (draggedTrack: ITrack, droppedTrack: ITrack) => {
        const draggedIndex = activeTrackList.findIndex(track => track.id === draggedTrack.id);
        const droppedIndex = activeTrackList.findIndex(track => track.id === droppedTrack.id);

        if (draggedIndex === -1 || droppedIndex === -1) return;

        const updatedTrackList = [...activeTrackList];
        updatedTrackList.splice(draggedIndex, 1);
        updatedTrackList.splice(droppedIndex, 0, draggedTrack);

        setActiveTrackList(updatedTrackList);
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
                        reorderedTrackList.map((track, index)=> (
                            <PlayerNextTrackItem
                                key={track.id}
                                track={track}
                                onDrop={handleDrop}
                                setCurrentDraggedTrack={setCurrentDraggedTrack}
                                currentDraggedTrack={currentDraggedTrack}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(PlayerDetailed);
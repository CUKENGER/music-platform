import { ITrack } from "@/types/track"
import { FC, useEffect, useRef, useState } from "react"
import styles from './TrackList.module.css'
import useActions from "@/hooks/useActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import useScroll from "@/hooks/useScroll";
import TrackItem from "../TrackItem/TrackItem";
import { sortList } from "@/services/sortList";

interface TrackListProps {
    tracks: ITrack[];
}

const TrackList: FC<TrackListProps> = ({tracks}) => {
    const [sortedTracks, setSortedTracks] = useState<ITrack[] | null>(null)

    const {setActiveTrackList, setCountTracks} = useActions()

    const { countTracks, offsetTracks} = useTypedSelector(state=> state.searchInputReducer)
    const {activeTrackList} = useTypedSelector(state => state.playerReducer)
    const {selectedSort} = useTypedSelector(state => state.dropdownReducer)

    const parentRef = useRef<HTMLDivElement>(null)
    const [isFetching, setIsFetching] = useScroll(() => {
        if(isFetching || countTracks < tracks.length || offsetTracks - countTracks == 10) {
            setCountTracks(countTracks + 10)
        }
    })

    // const sortTracks = (tracks: ITrack[], selectedSort: string) => {
    //     const sorted = [...tracks].sort((a, b) => {
    //         switch (selectedSort) {
    //             case 'Все':
    //                 if (a.id && b.id) {
    //                     return a.id - b.id;
    //                 }
    //             case 'По алфавиту':
    //                 const nameA = a.name.toLowerCase();
    //                 const nameB = b.name.toLowerCase();
    //                 return nameA.localeCompare(nameB);
    //             case 'Популярные':
    //                 return b.listens - a.listens;
    //             default:
    //                 return 0;
    //         }
    //     });
    //     setSortedTracks(sorted);
    // };

    useEffect(() => {
        if(sortedTracks) {
            setActiveTrackList(sortedTracks)
        }
    }, [sortedTracks])

    useEffect(() => {
        if (tracks) {
            sortList(tracks, selectedSort, setSortedTracks)
            // sortTracks(tracks, selectedSort);
        }
    }, [selectedSort, tracks]);

    return (
        <>
            <div ref={parentRef} className={styles.container}>
                {sortedTracks && sortedTracks.map((track) => (
                    <TrackItem 
                        key={track?.id} 
                        track={track} 
                        trackList={activeTrackList}
                    />
                ))}
                <div id="end-of-list" />
            </div>
        </>

    )
}

export default TrackList
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
    
    const [isFetching, setIsFetching] = useScroll(() => {
        if(isFetching || countTracks < tracks.length || offsetTracks - countTracks == 10) {
            setCountTracks(countTracks + 10)
        }
    })

    useEffect(() => {
        if(sortedTracks) {
            setActiveTrackList(sortedTracks)
        }
    }, [sortedTracks])

    useEffect(() => {
        if (tracks) {
            sortList(tracks, selectedSort, setSortedTracks)
        }
    }, [selectedSort, tracks]);

    return (
        <>
            <div className={styles.container}>
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
import { ITrack } from "@/types/track"
import { FC, useEffect} from "react"
import styles from './TrackList.module.css'
import useActions from "@/hooks/useActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import ListWithScroll from "@/components/ListWithScroll/ListWithScroll";
import TrackItem from "../TrackItem/TrackItem";

interface TrackListProps {
    tracks: ITrack[];
}

const TrackList: FC<TrackListProps> = ({tracks}) => {

    const {setActiveTrackList, setCountTracks} = useActions()

    const { countTracks, offsetTracks} = useTypedSelector(state=> state.searchInputReducer)
    const {activeTrackList} = useTypedSelector(state => state.playerReducer)
    const {selectedSort} = useTypedSelector(state => state.dropdownReducer)

    useEffect(() => {
        if(tracks) {
            setActiveTrackList(tracks)
        }
    }, [tracks])

    return (
        <ListWithScroll<ITrack>
            items={tracks}
            renderItem={(track: ITrack) => <TrackItem key={track.id} track={track} trackList={activeTrackList} />}
            selectedSort={selectedSort}
            setCountItems={setCountTracks}
            countItems={countTracks}
            offsetItems={offsetTracks}
            styles={{container: styles.container}}
        />
    )
}

export default TrackList
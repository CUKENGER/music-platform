import { memo } from "react";
import styles from './NavNextTracks.module.scss'
import { useTypedSelector } from "@/hooks/useTypedSelector";
import NavNextTrackItem from "./NavNextTrackItem";
import { Reorder } from "framer-motion";
import useActions from "@/hooks/useActions";
import { ITrack } from "@/types/track";

const NavNextTracks = () => {

  const activeTrackList = useTypedSelector(state => state.activeTrackListReducer.activeTrackList)
  const {setActiveTrackList} = useActions()

  return (
    <div className={styles.navNextTracks_container}>
      {activeTrackList && (
        <Reorder.Group
          axis="y"
          values={activeTrackList}
          onReorder={(newValues: ITrack[]) => setActiveTrackList(newValues)}
        >

          {activeTrackList.map((track) => (
            <NavNextTrackItem
              key={track.id}
              track={track}
            />
          ))}
        </Reorder.Group>
      )}
    </div>
  );
};

export default memo(NavNextTracks);
import useActions from "@/shared/hooks/useActions";
import { Reorder } from "framer-motion";
import { memo } from "react";
import NavNextTrackItem from "../NavNextTrackItem/NavNextTrackItem";
import styles from './NavNextTracks.module.scss';
import { ITrack } from "@/entities/track/model/types/track";
import { useTypedSelector } from "@/shared/hooks/useTypedSelector";

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
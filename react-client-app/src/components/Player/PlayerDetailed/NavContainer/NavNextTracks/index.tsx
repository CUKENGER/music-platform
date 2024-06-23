import { memo, useEffect, useState } from "react";
import styles from './NavNextTracks.module.scss'
import { useTypedSelector } from "@/hooks/useTypedSelector";
import NavNextTrackItem from "./NavNextTrackItem";

const NavNextTracks = () => {

  const {activeTrackList} = useTypedSelector(state => state.playerReducer)

  const [trackList, setTrackList] = useState(activeTrackList)

  useEffect(() => {
    setTrackList(activeTrackList);
  }, [activeTrackList]);

  return (
    <div className={styles.navNextTracks_container}>
      {trackList && trackList.map((track) => (
        <NavNextTrackItem
          key={track.id}
          track={track}
        />
      ))}
    </div>
  );
};

export default memo(NavNextTracks);
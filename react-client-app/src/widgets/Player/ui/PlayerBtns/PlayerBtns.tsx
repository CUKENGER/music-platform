import { memo } from "react";
import SwitchTrackBtns from "../SwitchTrackBtns/SwitchTrackBtns";
import styles from './PlayerBtns.module.scss';
import PlayPauseBtns from "@/features/PlayPauseBtns/ui/PlayPauseBtns";

const PlayerBtns = () => {
  return (
    <div className={styles.playerBtns_container}>
      <SwitchTrackBtns isNextBtn={false}/>
        <PlayPauseBtns/>
      <SwitchTrackBtns isNextBtn={true}/>
    </div>
  );
};

export default memo(PlayerBtns);
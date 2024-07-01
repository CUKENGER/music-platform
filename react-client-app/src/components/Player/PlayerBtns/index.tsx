import { FC, memo } from "react";
import styles from './PlayerBtns.module.scss'
import SwitchTrackBtns from "./SwitchTrackBtns";
import PlayPauseBtns from "./PlayPauseBtns";

interface PlayerBtnsProps{
}

const PlayerBtns:FC<PlayerBtnsProps> = () => {
  return (
    <div className={styles.playerBtns_container}>
      <SwitchTrackBtns isNextBtn={false}/>
        <PlayPauseBtns
        />
      <SwitchTrackBtns isNextBtn={true}/>
    </div>
  );
};

export default memo(PlayerBtns);
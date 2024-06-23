import { FC, memo } from "react";
import styles from './PlayerBtns.module.scss'
import SwitchTrackBtns from "./SwitchTrackBtns";
import PlayPauseBtns from "./PlayPauseBtns";

interface PlayerBtnsProps{
  onClick: () => void
}

const PlayerBtns:FC<PlayerBtnsProps> = ({onClick}) => {
  return (
    <div className={styles.playerBtns_container}>
      <SwitchTrackBtns isNextBtn={false}/>
        <PlayPauseBtns
          onClick={onClick}
        />
      <SwitchTrackBtns isNextBtn={true}/>
    </div>
  );
};

export default memo(PlayerBtns);
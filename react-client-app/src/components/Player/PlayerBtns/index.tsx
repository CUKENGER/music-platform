import { FC, memo } from "react";
import styles from './PlayerBtns.module.scss'
import SwitchTrackBtns from "./SwitchTrackBtns";
import PlayPauseBtns from "./PlayPauseBtns";

interface PlayerBtnsProps{
  needPrevNextBtns?: boolean
}

const PlayerBtns:FC<PlayerBtnsProps> = ({needPrevNextBtns=true}) => {
  return (
    <div className={styles.playerBtns_container}>
      {needPrevNextBtns && (<SwitchTrackBtns isNextBtn={false}/>)}
        <PlayPauseBtns/>
      {needPrevNextBtns && (<SwitchTrackBtns isNextBtn={true}/>)}
    </div>
  );
};

export default memo(PlayerBtns);
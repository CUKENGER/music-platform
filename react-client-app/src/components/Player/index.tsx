import { memo, useState } from "react";
import styles from './Player.module.scss'
import TrackProgress from "./TrackProgress";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import CoverContainer from "./CoverContainer";
import DurationContainer from "./DurationContainer";
import NameContainer from "@/UI/NameContainer";
import PlayerBtns from "./PlayerBtns";
import { usePlayerComponent } from "./usePlayerComponent";
import OpenPlayerBtn from "./OpenPlayerBtn";
import LikeContainer from "@/UI/LikeContainer";
import MixContainer from "./MixContainer";
import Portal from "../Portal";
import PlayerDetailed from "./PlayerDetailed";

const Player = () => {

  const { activeTrack } = useTypedSelector(state => state.playerReducer)

  const [isOpenPlayer, setIsOpenPlayer] = useState(false)

  const { playBtn, deleteLike, addLike } = usePlayerComponent()

  const handleOpen = () => {
    setIsOpenPlayer(!isOpenPlayer)
  }

  if (!activeTrack) {
    return null
  }

  return (
    <>
      <div className={styles.container}>
        <TrackProgress isVolume={false} />
        <div className={styles.main_container}>
          <div className={styles.main_info_container}>
            <CoverContainer
              cover={activeTrack?.picture}
            />
            <DurationContainer
              duration={activeTrack?.duration}
            />
            <NameContainer
              name={activeTrack?.name}
              artist={activeTrack?.artist}
            />
            <LikeContainer
              addLike={addLike}
              deleteLike={deleteLike}
              id={activeTrack?.id}
              likes={activeTrack?.likes}
            />
          </div>
          <PlayerBtns onClick={playBtn} />
          <div className={styles.rigth_container}>
            <MixContainer />
            <TrackProgress isVolume={true} />
            <OpenPlayerBtn
              onClick={handleOpen}
            />
          </div>
        </div>
        
      </div>
      {isOpenPlayer && (
          <Portal selector="#portal-root" isOpen={isOpenPlayer}>
            <PlayerDetailed/>
          </Portal>
        )}
    </>
  )
};

export default memo(Player);
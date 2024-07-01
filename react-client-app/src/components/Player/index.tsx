import { memo } from "react";
import styles from './Player.module.scss'
import TrackProgress from "./TrackProgress";
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
import useWindowWidth from "@/hooks/useWindowWidth";

const Player = () => {

  const { activeTrack, deleteLike, addLike, handleOpen, isOpenPlayer } = usePlayerComponent()

  const windowWidth = useWindowWidth()

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
              isItem={false}
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
          {windowWidth && windowWidth < 800 
            ? (<PlayerBtns needPrevNextBtns={false}/>) 
            : (<PlayerBtns/>)
          }
          
          <div className={styles.rigth_container}>
            <MixContainer />
            <TrackProgress isVolume={true} />
            <OpenPlayerBtn onClick={handleOpen} />
          </div>
        </div>

      </div>
      {isOpenPlayer && (
        <Portal selector="#portal-root" isOpen={isOpenPlayer}>
          <PlayerDetailed />
        </Portal>
      )}
    </>
  )
};

export default memo(Player);
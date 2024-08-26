import { useGetOneTrackQuery } from "@/api/Track/TrackService";
import useWindowWidth from "@/hooks/useWindowWidth";
import { useTypedSelector } from "@/shared/hooks/useTypedSelector";
import NameContainer from "@/shared/ui/NameContainer";
import LikeContainer from "@/UI/LikeContainer";
import { memo } from "react";
import Portal from "../../../../shared/ui/Portal/Portal";
import PlayerDetailed from "../../../PlayerDetailed/ui/PlayerDetailed/PlayerDetailed";
import { usePlayerComponent } from "../../model/usePlayerComponent";
import CoverContainer from "../CoverContainer/CoverContainer";
import DurationContainer from "../DurationContainer/DurationContainer";
import MixContainer from "../MixContainer/MixContainer";
import OpenPlayerBtn from "../OpenPlayerBtn/OpenPlayerBtn";
import PlayerBtns from "../PlayerBtns/PlayerBtns";
import TrackProgressBar from "../TrackProgressBar/TrackProgressBar";
import { VolumeControl } from "../VolumeControl/VolumeControl";
import styles from './Player.module.scss';
import PlayPauseBtns from "@/features/PlayPauseBtns/ui/PlayPauseBtns";

const Player = () => {

  const windowWidth = useWindowWidth()

  const activeTrack = useTypedSelector(state => state.playerReducer.activeTrack)

  const {data:track} = useGetOneTrackQuery(activeTrack?.id ?? 0)
 
  const { deleteLike, addLike, handleOpen, isOpenPlayer } = usePlayerComponent()

  if (!activeTrack) {
    return null
  }

  return (
    <>
      <div className={styles.container}>
        <TrackProgressBar/>
        <div className={styles.main_container}>
          <div className={styles.main_info_container}>
            <CoverContainer
              cover={activeTrack?.picture}
            />
            <div className={styles.duration}>
              <DurationContainer
                duration={activeTrack?.duration}
              />
            </div>
            <NameContainer
              name={activeTrack?.name}
              artist={activeTrack?.artist}
            />
            {track && (
              <LikeContainer
                addLike={addLike}
                deleteLike={deleteLike}
                track={track}
              />
            )}
          </div>
          {windowWidth && windowWidth < 800 
            ? (<PlayPauseBtns/>) 
            : (<PlayerBtns/>)
          }
          
          <div className={styles.rigth_container}>
            <MixContainer />
            <VolumeControl/>
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
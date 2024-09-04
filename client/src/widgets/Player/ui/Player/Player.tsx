import { ApiUrl, Portal } from '@/shared'
import styles from './Player.module.scss'
import openPlayerBtn from './assets/openPlayerBtn.svg'
import { CurrentTimeContainer, MixIcon, NameContainer, PlayPauseBtn, SwitchTrackBtns, TrackProgress, VolumeBar } from '@/entities'
import { PlayerDetailed } from '@/widgets/PlayerDetailed/ui/PlayerDetailed'
import { usePlayer } from '../../model/usePlayer'
import { TrackLikeContainer } from '@/features'

export const Player = () => {

  const {
    activeTrack,
    handleOpen,
    isOpenPlayer,
  } = usePlayer()

  if (!activeTrack) {
    return null
  }

  return (
    <>
      <div className={styles.container}>
        <TrackProgress />
        <div className={styles.main_container}>
          <div className={styles.main_info_container}>
            <div className={styles.cover_container}>
              <img
                className={styles.cover}
                src={ApiUrl + activeTrack?.picture}
                alt="cover"
              />
            </div>
            <div className={styles.duration}>
              <CurrentTimeContainer
                duration={activeTrack?.duration}
              />
            </div>
            <NameContainer
              name={activeTrack?.name}
              artist={activeTrack?.artist.name ?? '{уй'}
            />
            <TrackLikeContainer
              likes={activeTrack.likes}
              id={activeTrack.id}
            />
          </div>
          <div className={styles.play_btns}>
            <SwitchTrackBtns isNextBtn={false} />
            <PlayPauseBtn />
            <SwitchTrackBtns isNextBtn={true} />
          </div>

          <div className={styles.right_container}>
            <MixIcon />
            <VolumeBar />
            <div className={styles.openBtn_container} onClick={handleOpen}>
              <img
                className={styles.openBtn}
                src={openPlayerBtn}
                alt="openPlayerBtn"
              />
            </div>
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
}
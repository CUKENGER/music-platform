import { memo } from "react"
import styles from './PlayerMobileDetailed.module.css'
import useActions from "@/hooks/useActions"
import closeBtn from '@/assets/closeBtn.png'
import Image from "next/image"
import { baseUrl } from "@/services/baseUrl"
import { useTypedSelector } from "@/hooks/useTypedSelector"
import TrackProgress from "../TrackProgress/TrackProgress"

const PlayerMobileDetailed = () => {
  const {activeTrack} = useTypedSelector(state => state.playerReducer)

  const {setIsOpenPlayerMobileDetailed} = useActions()

  const handleClick = () => {
    setIsOpenPlayerMobileDetailed(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.close_btn_container} onClick={handleClick}>
          <Image
            src={closeBtn}
            alt="close btn icon"
          />
        </div>
      </div>
      <div className={styles.cover_container}>
        <img 
          className={styles.cover}
          src={baseUrl + activeTrack?.picture} 
          alt="cover image" 
        />
      </div>
      <div className={styles.main_container}>
        <div className={styles.name_container}>
          <p className={styles.name}>{activeTrack?.name}</p>
          <p className={styles.artist}>{activeTrack?.artist}</p>
        </div>
        <div className={styles.track_info_btn_container}>
          <div className={styles.btn}></div>
          <div className={styles.btn}></div>
          <div className={styles.btn}></div>
        </div>
      </div>
      <div className={styles.track_progress_container}>
        <TrackProgress isVolume={false}/>
      </div>
      <div className={styles.btns_container}></div>
    </div>
  )
}

export default memo(PlayerMobileDetailed)
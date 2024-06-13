import {  memo } from "react"
import styles from './PlayerMobile.module.css'
import PlayPauseBtns from "@/UI/PlayPauseBtns/PlayPauseBtns"
import SwitchTracksBtn from "../SwitchTracksBtn/SwitchTracksBtn"
import { usePlayer } from "@/hooks/player/usePlayer"
import useActions from "@/hooks/useActions"
import * as React from 'react'


const PlayerMobile = () => {

  const {activeTrack,playBtn, pause} = usePlayer()

  const {setIsOpenPlayerMobileDetailed} = useActions()

  const handleClick = () => {
    setIsOpenPlayerMobileDetailed(true)
  }

  const handlePlayBtn = (event:React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    playBtn()
  }

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.main_info_container}>
        <p className={styles.name}>
          {activeTrack?.name}
        </p>
        <p className={styles.artist}>
          {activeTrack?.artist}
        </p>
      </div>
      <div className={styles.btns_container}>
          <PlayPauseBtns onClick={(e) => handlePlayBtn(e)} pause={pause}/>
          <SwitchTracksBtn isNextBtn={true}/>
      </div>
    </div>
  )
}

export default memo(PlayerMobile)
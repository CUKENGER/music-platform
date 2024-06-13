import { FC, memo, useCallback } from 'react'
import styles from './TrackMenu.module.css'
import { useTypedSelector } from '@/hooks/useTypedSelector'
import useActions from '@/hooks/useActions'

interface TrackMenuProps{
  trackId:number
}

const TrackMenu:FC<TrackMenuProps> = ({trackId}) => { 

  const {activeTrackList} = useTypedSelector(state => state.playerReducer)
  const {setActiveTrackList} = useActions()

  const handleClick = useCallback((trackId:number) => {
    const newTrackList = activeTrackList.filter((i) => trackId !== i.id)
    setActiveTrackList(newTrackList)
  }, [activeTrackList])

  return (
    <div className={styles.menu}>
      <ul className={styles.menu_list}>
        <li
          className={styles.menu_item}
          onClick={() => handleClick(trackId)}
        >
          Удалить из очереди
        </li>
        <li className={styles.menu_item}>dsadsa</li>
        <li className={styles.menu_item}>dasdasd</li>
      </ul>
    </div>
  )
}

export default memo(TrackMenu) 
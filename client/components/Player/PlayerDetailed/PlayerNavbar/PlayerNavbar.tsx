import { FC, memo } from 'react';
import styles from './PlayerNavbar.module.css'

interface PlayerNavbarProps {
  setIsPressNext: (e: boolean) => void
  setIsPressText: (e: boolean) => void;
  isPressNext: boolean
  isPressText: boolean
}

const PlayerNavbar:FC<PlayerNavbarProps> = memo(({setIsPressNext, setIsPressText, isPressNext, isPressText}) => {
  
  const handleClickNext = () => {
    setIsPressNext(true)
    setIsPressText(false)
  }

  const handleClickText = () => {
    setIsPressText(true)
    setIsPressNext(false)
  }
  return (
    <div className={styles.navBar_container}>
      <div 
          onClick={handleClickNext}
          className={styles.navBar_item + ' ' + (isPressNext && styles.active)}
      >
          Далее
      </div>
      <div 
          onClick={handleClickText}
          className={styles.navBar_item + ' ' + (isPressText && styles.active)}
      >
          Текст
      </div>
      <div 
          onClick={handleClickText}
          className={styles.navBar_item}
      >
          Похожие
      </div>
    </div>
  )
})

export default PlayerNavbar
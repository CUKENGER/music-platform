import { usePlayerStore } from '@/entities'
import styles from './NavText.module.scss'


export const NavText = () => {

  const {activeTrack} = usePlayerStore()
  const lines = activeTrack?.text.split('\n')

  return (
    <div className={styles.container}>
      {lines && lines.map((line, index) => (
        <p key={index} className={styles.line}>
          {line}
        </p>
      ))}
    </div>
  )
}
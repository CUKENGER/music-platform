import { FC } from 'react';
import styles from './NameContainer.module.scss'

interface NameContainerProps {
  name: string | undefined;
  artist: string | undefined
}

export const NameContainer:FC<NameContainerProps> = ({name, artist}) => {
  return (
    <div>
      <div className={styles.name_container}>
        <p className={styles.name}>{name}</p>
        <p className={styles.artist}>{artist}</p>
      </div>
    </div>
  )
}
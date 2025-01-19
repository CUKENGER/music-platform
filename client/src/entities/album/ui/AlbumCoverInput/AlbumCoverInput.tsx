import { InputFile } from '@/shared'
import styles from './AlbumCoverInput.module.scss'

interface AlbumCoverInputProps {
  cover: File | null
  setCover: React.Dispatch<React.SetStateAction<File | null>>
}

export const AlbumCoverInput = ({cover, setCover}: AlbumCoverInputProps) => {
  return (
    <div className={styles.AlbumCoverInput}>
      <div className={styles.container}>
        <InputFile
          isAudio={false}
          setFile={setCover}
          fileName={cover?.name}
          placeholder='Загрузите обложку альбома'
        />
      </div>
    </div>
  )
}

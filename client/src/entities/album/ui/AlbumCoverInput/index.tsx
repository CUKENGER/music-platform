import { InputImageFile } from '@/shared/ui';
import styles from './AlbumCoverInput.module.scss';

interface AlbumCoverInputProps {
  setCover: React.Dispatch<React.SetStateAction<File | null>>;
}

export const AlbumCoverInput = ({ setCover }: AlbumCoverInputProps) => {
  return (
    <div className={styles.AlbumCoverInput}>
      <div className={styles.container}>
        <InputImageFile
          setFile={setCover}
          placeholder="Загрузите обложку альбома"
        />
      </div>
    </div>
  );
};

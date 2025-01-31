import { InputImageFile } from '@/shared/ui';
import styles from './AlbumCoverInput.module.scss';

interface AlbumCoverInputProps {
  cover: File | null;
  setCover: React.Dispatch<React.SetStateAction<File | null>>;
}

export const AlbumCoverInput = ({ cover, setCover }: AlbumCoverInputProps) => {
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

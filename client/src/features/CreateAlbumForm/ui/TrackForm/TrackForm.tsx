import styles from './TrackForm.module.scss';
import { FC } from 'react';
import minusBtnBg from '../assets/minusBtnBg.svg'
import { useTrackForm } from '../../model/useTrackForm';
import { TrackState } from '@/entities';

interface TrackFormProps {
  name: string;
  text: string;
  setName: (name: string) => void;
  setText: (text: string) => void;
  setAudio: (audio: File | null) => void;
  removeTrack: () => void;
  trackIndex: number;
  fileName?: string;
  track: TrackState;
  debouncedArtist: string;
}

export const TrackForm: FC<TrackFormProps> = ({ name, text, setName, setText, setAudio, removeTrack, trackIndex, fileName, track, debouncedArtist }) => {

  const {
    handleFileChange
  } = useTrackForm(setAudio, setName, debouncedArtist, setText, track)

  return (
    <div className={styles.TrackForm}>
      <div className={styles.index}>
        {trackIndex + 1}
      </div>
      <div className={styles.textInputContainer}>
        <label className={styles.label_input}>Введите название</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          name={`track-name-${trackIndex}`}
        />
        <label className={styles.label_input}>Введите текст</label>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          name={`track-text-${trackIndex}`}
        />
      </div>
      <div className={styles.inputAudio_container}>
        <input
          id={`track-audio-${trackIndex}`}
          className={styles.InputAudio}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          name={`track-audio-${trackIndex}`}
        />
        <label 
          className={`${styles.LabelAudio} ${fileName ? '' : styles.invalid}`}
          htmlFor={`track-audio-${trackIndex}`}
        >
          {fileName 
            ? fileName 
            : `Загрузите аудиодорожку`
          }
        </label>
      </div>
      {trackIndex !== 0 && (
        <div className={styles.minusBtn} onClick={removeTrack}>
          <img src={minusBtnBg}/>
        </div>
      )}
    </div>
  );
};

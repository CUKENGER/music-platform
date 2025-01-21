import styles from './TrackForm.module.scss';
import { ChangeEvent, useEffect } from 'react';
import minusBtnBg from './assets/minusBtnBg.svg'
import { TrackState } from '../../types/Track';
import { useDebounce } from '@/shared/hooks';
import { getLyrics } from '../../api/trackApi';

interface TrackFormProps {
  setName: (name: string) => void;
  setText: (text: string) => void;
  setAudio: (audio: File | null) => void;
  removeTrack: () => void;
  trackIndex: number;
  fileName?: string;
  track: TrackState;
  debouncedArtist: string;
}

export const TrackForm = ({
  setName,
  setText,
  setAudio,
  removeTrack,
  trackIndex,
  fileName,
  track,
  debouncedArtist,
}: TrackFormProps) => {

  const debouncedName = useDebounce(track.name, 500);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if(file?.name){
      console.log('file.name', file?.name)
      const str = file?.name;
      const word = str.split('.').slice(0, -1).join('.').replace(/^[\d\s\-.,_]+/g, '').trim().replace(/^\w/, (c) => c.toUpperCase());
      setName(word)
    } else {
      setName('')
    }
    setAudio(file);
  };

  useEffect(() => {
    const get = async () => {
      const lyrics = await getLyrics(debouncedName, debouncedArtist)
      if(lyrics) {
        setText(lyrics)
      } else {
        setText('')
      }
    }    
    get()
  }, [debouncedName, debouncedArtist])

  return (
    <div className={styles.TrackForm}>
      <div className={styles.index}>
        {trackIndex + 1}
      </div>
      <div className={styles.textInputContainer}>
        <label className={styles.label_input}>Введите название</label>
        <input
          type="text"
          value={track.name}
          onChange={(e) => setName(e.target.value)}
          name={`track-name-${trackIndex}`}
        />
        <label className={styles.label_input}>Введите текст</label>
        <textarea
          className={styles.textarea}
          value={track.text}
          onChange={(e) => {
            setText(e.target.value)
          }}
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
      {trackIndex !== 0 ? (
        <div className={styles.minusBtn} onClick={removeTrack}>
          <img src={minusBtnBg} />
        </div>
      ) : (
        <div className={styles.minusBtn}>
        </div>
      )}
    </div>
  );
};

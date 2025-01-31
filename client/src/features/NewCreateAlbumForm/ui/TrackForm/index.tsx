import { Controller, useFormContext } from 'react-hook-form';
import styles from './index.module.scss';
import { UITextAreaField, UITextField } from '@/shared/ui';
import minusBtnBg from './minusBtnBg.svg';

export const TrackForm = ({ trackIndex }: { trackIndex: number }) => {
  const { control, setValue } = useFormContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newTracks = Array.from(selectedFiles).map((file) => ({
        name: file.name
          .split('.')
          .slice(0, -1)
          .join('.')
          .replace(/^[\d\s\-.,_]+/g, '')
          .trim()
          .replace(/^\w/, (c) => c.toUpperCase()),
        text: '',
        audio: file,
      }));
      setValue('tracks', newTracks);
    }
  };

  const removeTrack = () => {};

  return (
    <div className={styles.TrackForm}>
      <div className={styles.index}>{trackIndex + 1}</div>
      <div className={styles.textInputContainer}>
        <Controller
          name="trackName"
          control={control}
          render={({ field }) => (
            <UITextField 
              {...field} 
              name="trackName" 
              label="Введите название" 
            />
          )}
        />
        <Controller
          name="trackText"
          control={control}
          render={({ field }) => (
            <UITextAreaField 
              {...field} 
              name="trackText" 
              label="Введите текст" 
            />
          )}
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
        <label className={`${styles.LabelAudio}`} htmlFor={`track-audio-${trackIndex}`}>
          `Загрузите аудиодорожку`
        </label>
      </div>
      {trackIndex !== 0 ?
        <div className={styles.minusBtn} onClick={removeTrack}>
          <img src={minusBtnBg} />
        </div>
      : <div className={styles.minusBtn}></div>}
    </div>
  );
};

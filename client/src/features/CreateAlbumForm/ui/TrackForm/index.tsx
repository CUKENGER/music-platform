import { Controller, useFormContext } from 'react-hook-form';
import styles from './index.module.scss';
import { UITextAreaField, UITextField } from '@/shared/ui';
import minusBtnBg from './minusBtnBg.svg';
import { CreateAlbumFormData } from '../../model/useCreateAlbumForm';

interface PropTypes {
  trackIndex: number;
}

export const TrackForm = ({ trackIndex }: PropTypes) => {
  const { control, setValue } = useFormContext<CreateAlbumFormData>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const name = file.name
        .split('.')
        .slice(0, -1)
        .join('.')
        .replace(/^[\d\s\-.,_]+/g, '')
        .trim()
        .replace(/^\w/, (c) => c.toUpperCase());
      setValue(`tracks.${trackIndex}.audio`, file);
      setValue(`tracks.${trackIndex}.name`, name);
    }
  };

  const removeTrack = () => {
    setValue('tracks', [
      ...control._formValues.tracks.slice(0, trackIndex),
      ...control._formValues.tracks.slice(trackIndex + 1),
    ]);
  };

  return (
    <div className={styles.TrackForm}>
      <div className={styles.index}>{trackIndex + 1}</div>
      <div className={styles.textInputContainer}>
        <Controller
          name={`tracks.${trackIndex}.name`}
          control={control}
          rules={{ required: 'Название трека обязательно' }}
          render={({ field }) => (
            <UITextField
              name={`tracks.${trackIndex}.name`}
              value={field.value}
              onChange={field.onChange}
              placeholder="Введите название трека"
            />
          )}
        />
        <Controller
          name={`tracks.${trackIndex}.text`}
          control={control}
          render={({ field }) => (
            <UITextAreaField
              name={`tracks.${trackIndex}.text`}
              value={field.value}
              onChange={field.onChange}
              placeholder="Введите текст трека"
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
        />
        <label
          className={styles.LabelAudio}
          htmlFor={`track-audio-${trackIndex}`}
        >
          Загрузите аудиодорожку
        </label>
      </div>
      {trackIndex !== 0 && (
        <div
          className={styles.minusBtn}
          onClick={removeTrack}
        >
          <img
            src={minusBtnBg}
            alt="Remove track"
          />
        </div>
      )}
    </div>
  );
};

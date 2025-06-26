import { Controller, useFormContext } from 'react-hook-form';
import styles from './index.module.scss';
import { UITextAreaField, UITextField } from '@/shared/ui';
import { CreateAlbumFormData } from '../../model/useCreateAlbumForm';
import { MinusBtn } from './MinusBtn';
import { axiosInstance } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDebounce } from '@/shared/hooks';

interface PropTypes {
  trackIndex: number;
  onRemove: () => void;
}

interface TrackSearchResponse {
  track_id: number;
  track_name: string;
  artist_name: string;
  track_genre: string | null;
}

interface Warning {
  condition?: boolean;
  text?: string;
}

export const TrackForm = ({ trackIndex, onRemove }: PropTypes) => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreateAlbumFormData>();

  const artist = watch('artist');
  const trackName = watch(`tracks.${trackIndex}.name`);
  const audioFile = watch(`tracks.${trackIndex}.audio`);

  const trackNameDebounced = useDebounce(trackName, 500);

  const { data: trackData } = useQuery<TrackSearchResponse>({
    queryKey: ['trackSearch', trackName, artist],
    queryFn: async () => {
      if (!trackName || !artist) return null;
      const response = await axiosInstance.get('/lyrics/search', {
        params: { track_name: trackName, artist_name: artist },
      });
      return response.data;
    },
    enabled: !!trackNameDebounced && !!artist,
    retry: false,
  });

  const { data: lyrics } = useQuery<string>({
    queryKey: ['lyrics', trackData?.track_id],
    queryFn: async () => {
      if (!trackData?.track_id) return '';
      const response = await axiosInstance.get('/lyrics', {
        params: { track_id: trackData.track_id },
      });
      return response.data;
    },
    enabled: !!trackData?.track_id,
    retry: false,
  });

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

  useEffect(() => {
    if (lyrics) {
      setValue(`tracks.${trackIndex}.text`, lyrics);
    }
  }, [lyrics, setValue, trackIndex]);

  const labelText = audioFile ? audioFile.name : 'Загрузите аудиодорожку';
  const trackNameWarnings: Warning[] = [];
  if (errors.tracks?.[trackIndex]?.name?.message) {
    trackNameWarnings.push({
      condition: true,
      text: errors.tracks[trackIndex].name.message,
    });
  }

  const trackTextWarnings: Warning[] = [];
  if (errors.tracks?.[trackIndex]?.text?.message) {
    trackTextWarnings.push({
      condition: true,
      text: errors.tracks[trackIndex].text.message,
    });
  }

  const audioWarnings: Warning[] = [];
  if (errors.tracks?.[trackIndex]?.audio?.message) {
    audioWarnings.push({
      condition: true,
      text: errors.tracks[trackIndex].audio.message,
    });
  }

  return (
    <div className={styles.TrackForm}>
      <div className={styles.inputs_container}>
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
                aria-invalid={trackNameWarnings.length > 0}
                warnings={trackNameWarnings}
              />
            )}
          />
          <Controller
            name={`tracks.${trackIndex}.text`}
            control={control}
            rules={{ required: 'Текст трека обязателен' }}
            render={({ field }) => (
              <UITextAreaField
                name={`tracks.${trackIndex}.text`}
                value={field.value}
                onChange={field.onChange}
                placeholder="Введите текст трека"
                aria-invalid={trackTextWarnings.length > 0}
                warnings={trackTextWarnings}
              />
            )}
          />
        </div>
      </div>
      <div className={styles.audio_container}>
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
            {labelText}
          </label>
          {audioWarnings.length > 0 && (
            <span className={styles.error}>{audioWarnings[0].text}</span>
          )}
        </div>
        {trackIndex !== 0 ?
          <div
            className={styles.minusBtn}
            onClick={onRemove}
          >
            <MinusBtn className={styles.minusBtn_icon} />
          </div>
        : <div className={styles.empty_minusBtn}></div>}
      </div>
    </div>
  );
};

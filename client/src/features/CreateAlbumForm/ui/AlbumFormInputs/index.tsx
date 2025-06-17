import { Controller, useFormContext } from 'react-hook-form';
import { CreateAlbumFormData } from '../../model/useCreateAlbumForm';
import { SearchArtistInput } from '@/entities/artist';
import { genres } from '@/shared/moks';
import { InputImageFile, UITextField, UITextAreaField, Options } from '@/shared/ui';
import Flatpickr from 'react-flatpickr';
import styles from './index.module.scss';

export const AlbumFormInputs = () => {
  const { control, setValue } = useFormContext<CreateAlbumFormData>();

  return (
    <div className={styles.container}>
      <Controller
        name="cover"
        control={control}
        rules={{ required: 'Обложка обязательна' }}
        render={({ field }) => (
          <InputImageFile
            setFile={field.onChange}
            placeholder="Загрузите обложку альбома"
          />
        )}
      />
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Название обязательно' }}
        render={({ field }) => (
          <UITextField
            name="name"
            value={field.value}
            onChange={field.onChange}
            placeholder="Введите название"
          />
        )}
      />
      <Controller
        name="artist"
        control={control}
        rules={{ required: 'Исполнитель обязателен' }}
        render={({ field }) => (
          <SearchArtistInput
            setArtist={field.onChange}
            artist={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        rules={{ required: 'Описание обязательно' }}
        render={({ field }) => (
          <UITextAreaField
            placeholder="Введите описание"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="releaseDate"
        control={control}
        rules={{ required: 'Дата выхода обязательна' }}
        render={({ field }) => (
          <>
            <label>Введите дату выхода</label>
            <Flatpickr
              data-enable-time
              options={{
                dateFormat: 'd-m-Y',
                maxDate: new Date(),
                onChange: (selectedDates) => {
                  setValue('releaseDate', selectedDates[0]);
                },
                defaultDate: field.value,
              }}
            />
          </>
        )}
      />
      <Controller
        name="genre"
        control={control}
        rules={{ required: 'Жанр обязателен' }}
        render={({ field }) => (
          <Options
            options={genres}
            setOption={field.onChange}
          />
        )}
      />
    </div>
  );
};

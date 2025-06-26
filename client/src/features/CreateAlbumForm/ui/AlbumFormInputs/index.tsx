import { Controller, useFormContext } from 'react-hook-form';
import { CreateAlbumFormData } from '../../model/useCreateAlbumForm';
import { SearchArtistInput } from '@/entities/artist';
import { genres } from '@/shared/moks';
import { InputImageFile, UITextField, UITextAreaField, Options } from '@/shared/ui';
import styles from './index.module.scss';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import { ru } from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-custom.scss';

// Регистрируем русскую локализацию
registerLocale('ru', ru);

export const AlbumFormInputs = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CreateAlbumFormData>();

  return (
    <div className={styles.container}>
      <div className={styles.input_container}>
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
              aria-invalid={`${!!errors.name?.message}`}
              warnings={[{ condition: !!errors.name, text: errors.name?.message }]}
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
              aria-invalid={!!errors.artist}
              placeholder="Введите или найдите исполнителя"
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
              aria-invalid={!!errors.description}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="releaseDate"
          control={control}
          rules={{ required: 'Дата выхода обязательна' }}
          render={({ field }) => (
            <div className="datepicker-container">
              <label>Введите дату выхода</label>
              <DatePicker
                selected={
                  field.value ?
                    typeof field.value === 'string' ?
                      new Date(field.value)
                    : field.value
                  : null
                }
                onChange={(date: Date | null) => {
                  setValue('releaseDate', date, { shouldValidate: true });
                }}
                dateFormat="dd.MM.yyyy"
                maxDate={new Date()}
                locale="ru"
                placeholderText="Выберите дату"
                className="datepicker-input"
                wrapperClassName="datepicker-wrapper"
                popperClassName="datepicker-popper"
                showPopperArrow={false}
                popperPlacement="bottom-start"
                aria-invalid={!!errors.releaseDate}
              />
            </div>
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
              label="Выберите жанр"
              aria-invalid={!!errors.genre}
            />
          )}
        />
      </div>
      <div className={styles.image_container}>
        <Controller
          name="cover"
          control={control}
          rules={{ required: 'Обложка обязательна' }}
          render={({ field }) => (
            <InputImageFile
              setFile={field.onChange}
              placeholder="Загрузите обложку альбома"
              aria-invalid={!!errors.cover}
            />
          )}
        />
      </div>
    </div>
  );
};

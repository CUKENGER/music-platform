import styles from './MainInfoInputs.module.scss';
import Flatpickr from 'react-flatpickr';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { IAlbum } from '../../types/Album';
import { InputFile, Options, UITextAreaField, UITextField } from '@/shared/ui';
import { SearchArtistInput } from '@/entities/artist';
import { genres } from '@/shared/moks';
import { API_URL } from '@/shared/consts';
import { EditAlbumInputs } from '@/features/EditAlbumForm/model/useEditAlbumForm';

interface MainInfoInputsProps {
  control: Control<EditAlbumInputs>;
  setValue: UseFormSetValue<EditAlbumInputs>;
  album: IAlbum | undefined;
}

export const MainInfoInputs = ({ control, setValue, album }: MainInfoInputsProps) => {
  return (
    <div className={styles.album_inputs}>
      <div className={styles.main_info_inputs}>
        <div className={styles.container}>
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <UITextField
                value={field.value}
                onChange={field.onChange}
                placeholder="Введите название"
              />
            )}
          />
          <Controller
            name="artist"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <SearchArtistInput 
                artist={field.value} 
                onChange={field.onChange} 
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <UITextAreaField
                placeholder="Введите описание"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <label className={styles.label}>Введите дату выхода</label>
          <Controller
            name="releaseDate"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Flatpickr
                className={styles.input_date}
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
            )}
          />
          <Controller
            name="genre"
            control={control}
            rules={{ required: true }}
            render={() => <Options options={genres} currentOption={album?.genre} />}
          />
        </div>
      </div>
      <div className={styles.album_cover_input}>
        <div className={styles.album_cover_input_container}>
          <Controller
            name="cover"
            control={control}
            render={({ field }) => (
              <InputFile
                isAudio={false}
                setFile={field.onChange}
                fileName={'[eq'}
                currentPicture={API_URL + album?.picture}
                placeholder="Загрузите обложку альбома"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

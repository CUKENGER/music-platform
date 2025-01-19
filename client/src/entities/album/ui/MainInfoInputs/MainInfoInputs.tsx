import { ApiUrl, genres, Input, InputFile, Options, Textarea } from '@/shared'
import styles from './MainInfoInputs.module.scss'
import { IAlbum, SearchArtistInput } from '@/entities'
import Flatpickr from "react-flatpickr";
import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { EditAlbumInputs } from '@/features/EditAlbumFormLib/model/useEditAlbumForm';

interface MainInfoInputsProps {
  control: Control<EditAlbumInputs>;
  setValue: UseFormSetValue<EditAlbumInputs>;
  album: IAlbum | undefined;
}

export const MainInfoInputs = ({
  control,
  setValue,
  album
}: MainInfoInputsProps) => {
  return (
    <div className={styles.album_inputs}>
      <div className={styles.main_info_inputs}>
        <div className={styles.container}>
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                value={field.value}
                onChange={field.onChange}
                placeholder='Введите название'
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
                setArtist={field.onChange}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Textarea
                placeholder='Введите описание'
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
                  dateFormat: "d-m-Y",
                  maxDate: new Date(),
                  onChange: (selectedDates) => {
                    setValue('releaseDate', selectedDates[0]);
                  },
                  defaultDate: field.value
                }}
              />
            )}
          />
          <Controller
            name="genre"
            control={control}
            rules={{ required: true }}
            render={() => (
              <Options
                options={genres}
                currentOption={album?.genre}
              />
            )}
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
                currentPicture={ApiUrl + album?.picture}
                placeholder='Загрузите обложку альбома'
              />
            )}
          />
        </div>
      </div>
    </div>
  )
}

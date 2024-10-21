import { Btn, Input, InputFile, ModalContainer, Options, PrivateRoutes, Textarea } from '@/shared';
import styles from './CreateAlbumForm.module.scss';
import { TrackForm } from './TrackForm/TrackForm';
import plusBtn from './assets/plusBtnBg.svg'
import { SearchArtistInput} from '@/entities';
import { Link } from 'react-router-dom';
import Flatpickr from "react-flatpickr";
import 'flatpickr/dist/flatpickr.min.css';
import { useCreateAlbumForm } from '../model/useCreateAlbumForm';

export const CreateAlbumForm = () => {
  
  const {
    handleSubmit,
    name,
    artist,
    description,
    releaseDate,
    setReleaseDate,
    options, 
    setOptions,
    genre,
    setCover,
    cover,
    tracks,
    updateTrack,
    removeTrack,
    addTrackForm,
    isPending,
    modal,
    debouncedArtist,
    hideModal
  } = useCreateAlbumForm()

  return (
    <form className={styles.Form} onSubmit={handleSubmit}>
      <Link to={PrivateRoutes.ALBUMS}>
        <Btn small={true}>
          Назад
        </Btn>
      </Link>
      <div className={styles.album_inputs}>
        <div className={styles.album_inputs_left}>
          <div className={styles.album_inputs_left_inner}>
            <Input
              inputValue={name}
              placeholder='Введите название'
            />
            <SearchArtistInput
              artist={artist}
            />
            <Textarea
              inputValue={description}
              placeholder='Введите описание'
            />
            <label className={styles.label}>Введите дату выхода</label>
            <Flatpickr
              className={styles.input_date}
              value={releaseDate}
              onChange={([date]) => setReleaseDate(date)}
              options={{ 
                dateFormat: "d-m-Y",
                maxDate: new Date()
              }}
            />
            <Options
              options={options}
              setOptions={setOptions}
              setValue={genre.setValue}
              value={genre.value}
            />
          </div>
        </div>
        <div className={styles.album_inputs_right}>
          <div className={styles.album_inputs_right_inner}>
            <InputFile
              isAudio={false}
              setFile={setCover}
              fileName={cover?.name}
              placeholder='Загрузите обложку альбома'
            />
          </div>
        </div>
      </div>
      {tracks.map((track, index) => (
        <TrackForm
          track={track}
          key={index}
          name={track.name}
          text={track.text}
          setName={(name) => updateTrack(index, 'name', name)}
          setText={(text) => updateTrack(index, 'text', text)}
          setAudio={(audio) => updateTrack(index, 'audio', audio)}
          removeTrack={() => removeTrack(index)}
          trackIndex={index}
          fileName={track.audio?.name}
          debouncedArtist={debouncedArtist}
        />
      ))}
      <div className={styles.plusBtn} onClick={addTrackForm}>
        <img src={plusBtn} />
      </div>
      <Btn
        isLoading={isPending}
        type='submit'
      >
        Загрузить
      </Btn>
      {modal.isOpen && (
        <ModalContainer
          hideModal={hideModal}
          text={modal.message}
          onClick={modal.onClick}
        />
      )}
    </form>
  );
};

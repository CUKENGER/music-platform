import {
  AlbumCommonForm,
  AlbumCoverInput,
  MainInfoInputs,
  MultipleInputAudio,
  TrackFormList,
} from '@/entities/album';
import { useCreateAlbumForm } from '../model/useCreateAlbumForm';
import styles from './CreateAlbumForm.module.scss';
import { PRIVATE_ROUTES } from '@/shared/consts';

export const CreateAlbumForm = () => {
  const {
    handleSubmit,
    onSubmit,
    isPending,
    modal,
    hideModal,
    handleFileChange,
    hasData,
    debouncedArtist,
    addTrackForm
  } = useCreateAlbumForm();

  return (
    <AlbumCommonForm
      backLink={PRIVATE_ROUTES.ALBUMS}
      onSubmit={handleSubmit(onSubmit)}
      hasData={hasData}
      isPending={isPending}
    >
      <div className={styles.album_inputs}>
        <MainInfoInputs
          name={name}
          artist={artist}
          description={description}
          releaseDate={releaseDate}
          setReleaseDate={setReleaseDate}
          options={options}
          setOptions={setOptions}
          genre={genre}
        />
        <AlbumCoverInput cover={cover} setCover={setCover} />
      </div>
      <MultipleInputAudio onChange={handleFileChange} />
      <TrackFormList tracks={tracks} setTracks={setTracks} debouncedArtist={debouncedArtist} />
      <AddTrackIcon onClick={addTrackForm} />
      <ModalContainer modal={modal} hideModal={hideModal} />
    </AlbumCommonForm>
  );
};

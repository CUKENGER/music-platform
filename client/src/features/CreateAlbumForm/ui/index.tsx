// src/features/album/components/CreateAlbumForm.tsx
import { FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';
import { Btn, ModalContainer } from '@/shared/ui';
import { PRIVATE_ROUTES } from '@/shared/consts';
import { AlbumFormInputs } from './AlbumFormInputs';
import { TrackFormsList } from './TrackFormsList';
import { useCreateAlbumForm } from '../model/useCreateAlbumForm';

export const CreateAlbumForm = () => {
  const {
    methods,
    isPending,
    isValid,
    onSubmit,
    modal,
    hideModal,
    fields,
    addTrack,
    reorderTracks,
  } = useCreateAlbumForm();

  return (
    <FormProvider {...methods}>
      <form
        className={styles.Form}
        onSubmit={onSubmit}
      >
        <Link to={PRIVATE_ROUTES.ALBUMS}>
          <Btn>Назад</Btn>
        </Link>
        <AlbumFormInputs />
        <TrackFormsList
          tracks={fields}
          addTrack={addTrack}
          reorderTracks={reorderTracks}
        />
        <Btn
          isLoading={isPending}
          type="submit"
          disabled={!isValid}
        >
          Загрузить
        </Btn>
        <ModalContainer
          modal={modal}
          hideModal={hideModal}
        />
      </form>
    </FormProvider>
  );
};

import { Controller } from 'react-hook-form';
import { useEditAlbumForm } from '../model/useEditAlbumForm';
import { AlbumCommonForm, EditTrackFormList, MainInfoInputs, MultipleInputAudio } from '@/entities/album';
import { PRIVATE_ROUTES } from '@/shared/consts';
import { AddTrackIcon, ModalContainer } from '@/shared/ui';

export const EditAlbumForm = () => {

  const {
    album,
    isPending,
    handleSubmit,
    onSubmit,
    control,
    getValues,
    setValue,
    handleFileChange,
    addTrackForm,
    debouncedArtist,
    modal,
    hideModal,
  } = useEditAlbumForm()

  return (
    <AlbumCommonForm
      backLink={PRIVATE_ROUTES.ALBUMS + `/${album?.id}`}
      onSubmit={handleSubmit(onSubmit)}
      hasData={true}
      isPending={isPending}
    >
      <MainInfoInputs
        album={album}
        control={control}
        setValue={setValue}
      />
      <MultipleInputAudio onChange={handleFileChange} />
      <Controller
        name='tracks'
        control={control}
        render={({ field }) => (
          <EditTrackFormList
            tracks={field.value}
            debouncedArtist={debouncedArtist}
            setValue={setValue}
            getValues={getValues}
          />
        )}
      />
      <AddTrackIcon onClick={addTrackForm} />
        <ModalContainer
          modal={modal}
          hideModal={hideModal}
        />
    </AlbumCommonForm>
  )
}

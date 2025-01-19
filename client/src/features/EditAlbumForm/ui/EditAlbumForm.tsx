import { AlbumCommonForm, EditTrackFormList, MainInfoInputs, MultipleInputAudio } from '@/entities';
import { AddTrackIcon, ModalContainer, PrivateRoutes } from '@/shared';
import { Controller } from 'react-hook-form';
import { useEditAlbumForm } from '../model/useEditAlbumForm';

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
      backLink={PrivateRoutes.ALBUMS + `/${album?.id}`}
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
      {modal.isOpen && (
        <ModalContainer
          hideModal={hideModal}
          text={modal.message}
          onClick={modal.onClick}
        />
      )}
    </AlbumCommonForm>
  )
}
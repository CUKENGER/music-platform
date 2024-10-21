import { AlbumInfo, useGetOneAlbum } from "@/entities";
import { useNavigate, useParams } from "react-router-dom";
import { Loader, ModalContainer, PrivateRoutes, useModal } from "@/shared";

export const AlbumPage = () => {

  const { id } = useParams();
  const navigate = useNavigate()
  const {hideModal, modal, showModal} = useModal()

  const {data: album, error, isError, isLoading} = useGetOneAlbum(Number(id))

  console.log('album', album)

  if(isError) {
    showModal(`Произошла ошибка, попробуйте позже ${error.message}`, () => {
      navigate(PrivateRoutes.ALBUMS)
    })
  }

  if(isLoading) {
    return <Loader/>
  }

  return (
    <>
      <AlbumInfo album={album}/>
      {modal.isOpen && (
        <ModalContainer
          hideModal={hideModal}
          text={modal.message}
          onClick={modal.onClick}
        />
      )}
    </>
  )
}
import { AlbumInfo, useGetOneAlbum } from "@/entities/album";
import { PRIVATE_ROUTES } from "@/shared/consts";
import { useModal } from "@/shared/hooks";
import { Loader, ModalContainer } from "@/shared/ui";
import { useNavigate, useParams } from "react-router-dom";

export const AlbumPage = () => {

  const { id } = useParams();
  const navigate = useNavigate()
  const {hideModal, modal, showModal} = useModal()

  const {data: album, error, isError, isLoading} = useGetOneAlbum(Number(id))

  if(isError) {
    showModal(`Произошла ошибка, попробуйте позже ${error.message}`, () => {
      navigate(PRIVATE_ROUTES.ALBUMS)
    })
  }

  if(isLoading) {
    return <Loader/>
  }

  return (
    <>
      <AlbumInfo album={album}/>
        <ModalContainer
          modal={modal}
          hideModal={hideModal}
        />
    </>
  )
}

import { useGetOneArtist, useUpdateArtist } from "@/entities"
import { ApiUrl, Btn, Input, InputFile, ModalContainer, Options, PrivateRoutes, Textarea, genres, useInput, useModal } from "@/shared"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import styles from './EditArtistForm.module.scss'

export const EditArtistForm = () => {

  const { id } = useParams()
  const { modal, hideModal, showModal } = useModal()
  const navigate = useNavigate()

  const { data: artist } = useGetOneArtist(Number(id))
  const { mutate: updateArtist, isPending: isLoading } = useUpdateArtist(Number(id))

  const name = useInput(artist?.name || '', { isEmpty: true })
  const genre = useInput(artist?.genre || '', { isEmpty: true })
  const description = useInput(artist?.description || '', { isEmpty: true })
  const [picture, setPicture] = useState<File | null>(null)
  const [options, setOptions] = useState(genres)

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!picture && !artist?.picture) {
      showModal('Загрузите изображение')
      return
    }

    const artistDto = {
      name: name.value.trim(),
      description: description.value.trim(),
      genre: genre.value.trim(),
      picture: picture as File
    }

    updateArtist(artistDto, {
      onSuccess: () => {
        showModal('Исполнитель успешно обновлен', () => navigate(`${PrivateRoutes.ARTISTS}/${id}`))
      },
      onError: () => {
        showModal('Произошла ошибка при обновлении исполнителя')
      }
    })
  }

  const hasData = name.value && genre.value && description.value

  return (
    <form className={styles.form}>
      <Link to={`${PrivateRoutes.ARTISTS}/${id}`}>
        <Btn small={true}>
          Назад
        </Btn>
      </Link>
      <div className={styles.container}>
        <div className={styles.inputs_container}>
          <Input
            inputValue={name}
            placeholder='Введите имя исполнителя'
          />
          <Textarea
            inputValue={description}
            placeholder='Введите описание исполнителя'
          />
          <Options
            options={options}
            setOptions={setOptions}
            setValue={genre.setValue}
            value={genre.value}
          />
        </div>
        <div className={styles.picture_container}>
          <div className={styles.picture_input_container}>
            <InputFile
              isAudio={false}
              placeholder="Загрузите обложку исполнителя"
              setFile={setPicture}
              fileName={picture?.name}
              currentPicture={ApiUrl + artist?.picture}
            />
          </div>
        </div>
      </div>
      <Btn
        onClick={handleSubmit}
        isLoading={isLoading}
        disabled={!hasData}
      >
        Отправить
      </Btn>
      {modal.isOpen && (
        <ModalContainer
          hideModal={hideModal}
          text={modal.message}
          onClick={modal.onClick}
        />
      )}
    </form>
  )
}

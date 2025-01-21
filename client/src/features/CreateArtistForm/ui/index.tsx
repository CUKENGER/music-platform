import styles from './CreateArtistForm.module.scss'
import { Link } from 'react-router-dom'
import { useCreateArtistForm } from '../model/useCreateArtistForm'
import { Btn, InputFile, InputForHook, ModalContainer, Options, TextareaForHook } from '@/shared/ui'
import { PRIVATE_ROUTES } from '@/shared/consts'

export const CreateArtistForm = () => {

  const {
    name,
    description,
    options,
    setOptions,
    genre,
    setPicture,
    picture,
    handleSubmit,
    isLoading,
    hasData,
    modal,
    hideModal
  } = useCreateArtistForm()

  return (
    <form className={styles.CreateArtistForm} onSubmit={handleSubmit}>
      <Link to={PRIVATE_ROUTES.ARTISTS}>
        <Btn small={true}>
          Назад
        </Btn>
      </Link>
      <InputForHook
        inputValue={name}
        placeholder='Введите имя исполнителя'
      />
      <TextareaForHook
        inputValue={description}
        placeholder='Введите описание исполнителя'
      />
      <Options
        options={options}
        //setOptions={setOptions}
        //setValue={genre.setValue}
        //value={genre.value}
      />
      <InputFile
        isAudio={false}
        placeholder="Загрузите обложку исполнителя"
        setFile={setPicture}
        fileName={picture?.name}
      />
      <Btn
        onClick={handleSubmit}
        isLoading={isLoading}
        disabled={!hasData}
      >
        Отправить
      </Btn>
        <ModalContainer
          hideModal={hideModal}
          modal={modal}
        />
    </form>
  )
}

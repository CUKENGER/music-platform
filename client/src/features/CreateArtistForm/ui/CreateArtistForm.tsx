import { Btn, Input, InputFile, ModalContainer, Options, PrivateRoutes, Textarea } from '@/shared'
import styles from './CreateArtistForm.module.scss'
import { Link } from 'react-router-dom'
import { useCreateArtistForm } from '../model/useCreateArtistForm'

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
      <Link to={PrivateRoutes.ARTISTS}>
        <Btn small={true}>
          Назад
        </Btn>
      </Link>
      <div className={styles.main_container}>
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
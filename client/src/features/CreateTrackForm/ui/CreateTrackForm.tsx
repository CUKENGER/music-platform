import { Btn, Input, InputFile, ModalContainer, Options, Textarea } from '@/shared'
import styles from './CreateTrackForm.module.scss'
import { useCreateTrackForm } from '../model/useCreateTrackForm'
import { SearchArtistInput } from '@/entities'

export const CreateTrackForm = () => {

  const {
    name,
    artist,
    options,
    setOptions,
    genre,
    text,
    setCover,
    cover,
    setAudio,
    audio,
    handleSubmit,
    isLoading,
    hasData,
    modal,
    hideModal
  } = useCreateTrackForm()

  return (
    <>
      <form className={styles.form} name='create_track'>
        <div className={styles.fields_container}>
          <Input
            inputValue={name}
            placeholder='Введите название'
          />
          <SearchArtistInput
            artist={artist}
          />
          <Options
            options={options}
            setOptions={setOptions}
            setValue={genre.setValue}
            value={genre.value}
          />
          <Textarea
            placeholder='Введите текст песни'
            inputValue={text}
          />
        </div>
        <div className={styles.fields_upload_container}>
          <div className={styles.input_cover}>
            <InputFile
              isAudio={false}
              placeholder="Загрузите обложку трека"
              setFile={setCover}
              fileName={cover?.name}
            />
          </div>
          <div className={styles.input_audio}>
            <InputFile
              isAudio={true}
              placeholder="Загрузите аудиодорожку"
              setFile={setAudio}
              fileName={audio?.name}
            />
          </div>
        </div>
      </form>
      <Btn
        onClick={handleSubmit}
        isLoading={isLoading}
        disabled={!hasData}
        className={styles.upload_btn}

      >
        Отправить
      </Btn>
      {modal.isOpen && (
        <ModalContainer 
          text={modal.message}
          hideModal={hideModal} 
          onClick={modal.onClick}
        />
          
      )}
    </>
  )
}
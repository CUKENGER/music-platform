import { memo, useEffect, useState } from "react"
import styles from '@/styles/changeTrackPage.module.css'
import InputString from "@/UI/InputString/InputString"
import CheckInput from "@/UI/CheckInput/CheckInput"
import { useInput } from "@/hooks/useInput"
import { genres } from "@/services/genres"
import MainLayout from "@/layouts/MainLayout"
import ImageInput from "@/UI/ImageInput/ImageInput"
import AudioInput from "@/UI/AudioInput/AudioInput"
import Textarea from "@/UI/Textarea/Textarea"
import { useTypedSelector } from "@/hooks/useTypedSelector"
import { useRouter } from "next/router"
import { baseUrl } from "@/services/baseUrl"
import Btn from "@/UI/Btn/Btn"
import { useUpdateTrackMutation } from "@/api/Track/TrackService"
import useModal from "@/hooks/useModal"
import ModalContainer from "@/UI/ModalContainer/ModalContainer"
import { ITrack } from "@/types/track"
import useChangeTrack from "@/api/Track/useChangeTrack"

const ChangeTrackPage = () => {
  const router = useRouter()
  const {openedTrack } = useTypedSelector(state=> state.playerReducer)
  const {
    name,
    artist,
    text,
    options,
    setOptions,
    genre,
    setCover,
    setAudio,
    handleChange,
    isLoading,
    modal,
    hideModal,
  } = useChangeTrack()
  
  useEffect(() => {
    if(!openedTrack) {
      router.push('/tracks')
    }
  },[router, openedTrack])
  
  const currentPicture = baseUrl + openedTrack?.picture
  const currentGenre = openedTrack?.genre ?? ''
  const audioName = openedTrack?.name + '.mp3'

  const handleBack = () => {
    if(openedTrack) {
      router.push('/tracks/' + openedTrack?.id)
    } else{
      router.push('/tracks')
    } 
  }

  return (
    <MainLayout>
      <div className={styles.main_container}>
        <div className={styles.btn_back_container}>
          <Btn onClick={handleBack}>
                Назад
          </Btn>
        </div>
        
        <div className={styles.container}>
          <div className={styles.main_info_container}>
            <div className={styles.name_input}>
              <InputString
                placeholder="Введите название трека"
                setValue={name.setValue}
                value={name.value}
                isRequired={true}
              />
            </div>
            <div className={styles.artist_input}>
              <InputString
                placeholder="Введите исполнителя"
                setValue={artist.setValue}
                value={artist.value}
                isRequired={true}
              />
            </div>
            <div className={styles.text_input}>
              <Textarea
                isRequired={true}
                placeholder="Введите текст песни"
                setValue={text.setValue}
                value={text.value}
              />
            </div>
            <div className={styles.genre_input}>
              <p className={styles.genre_title}>Выберите жанр</p>
              <CheckInput
                currentOption={currentGenre}
                options={options}
                setOptions={setOptions}
                setValue={genre.setValue}
                value={genre.value}
              />
            </div>
          </div>
          <div className={styles.files_container}>
            <div className={styles.image_input}>
              <ImageInput
                placeholder="Загрузите обложку"
                setPicture={setCover}
                currentPicture={currentPicture}
              />
            </div>
            <div className={styles.track_input}>
              <AudioInput
                audioName={audioName}
                placeholder="Загрузите аудиодорожку"
                setAudio={setAudio}
              />
            </div>
          </div>
        </div>
        <button className={styles.changeBtn} onClick={handleChange}>
          {isLoading &&(<span className={styles.loader}></span>)}
          Отправить
        </button>
      </div>
      {modal.isOpen && (
        <ModalContainer
          hideModal={hideModal}
          text={modal.message}
          onClick={modal.onClick}
        />
      )}
    </MainLayout>
  )
}

export default memo(ChangeTrackPage)
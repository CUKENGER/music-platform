import { memo } from "react";
import styles from './CreateTrackForm.module.scss'
import InputString, { InputTypes } from "@/UI/InputString";
import Textarea from "@/UI/Textarea";
import InputFile from "@/UI/InputFile";
import UploadBtn from "@/UI/UploadBtn";
import ModalContainer from "@/UI/ModalContainer";
import useCreateTrackForm from "./useCreateTrackForm";
import CheckInput from "@/UI/CheckInput";

const CreateTrackForm = () => {

  const {
    name,
    artist,
    text,
    genre,
    audio,
    cover,
    handleSubmit,
    hideModal,
    modal,
    hasData,
    setAudio,
    setCover, 
    isLoading,
    options,
    setOptions
  } = useCreateTrackForm()

  return (
    <>
      <form className={styles.create_container} name="create_track">
        <div className={styles.inputs_container}>
          <InputString
            onChange={name.onChange}
            onBlur={name.onBlur}
            placeholder="Введите название"
            value={name.value}
            isEmpty={name.isEmpty}
            setValue={name.setValue}
            type={InputTypes.TEXT}
          />
          <InputString
            onChange={artist.onChange}
            onBlur={artist.onBlur}
            placeholder="Введите исполнителя"
            value={artist.value}
            isEmpty={artist.isEmpty}
            setValue={artist.setValue}
            type={InputTypes.TEXT}
          />
          <CheckInput
            options={options}
            setOptions={setOptions}
            setValue={genre.setValue}
            value={genre.value}
          />
          <Textarea
            onChange={text.onChange}
            onBlur={text.onBlur}
            placeholder="Введите текст песни"
            value={text.value}
            isEmpty={text.isEmpty}
            setValue={text.setValue}
          />

        </div>
        <div className={styles.inputs_upload_container}>
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
      <UploadBtn
        onClick={handleSubmit}
        isEmpty={!hasData}
        isLoading={isLoading}
      />
      {modal.isOpen && (
        <ModalContainer 
          text={modal.message}
          hideModal={hideModal} 
          onClick={modal.onClick}
        />
          
      )}
    </>
  );
};

export default memo(CreateTrackForm);
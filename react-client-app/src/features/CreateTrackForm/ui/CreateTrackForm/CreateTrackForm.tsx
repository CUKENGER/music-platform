import Btn from "@/shared/ui/Btn/Btn";
import { Input } from "@/shared/ui/Input/Input";
import Textarea from "@/shared/ui/Textarea/Textarea";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import useCreateTrackForm from "../../model/useCreateTrackForm";
import CheckInput from "../CheckInput/CheckInput";
import InputFile from "../InputFile/InputFile";
import styles from './CreateTrackForm.module.scss';
import ModalContainer from "@/shared/ui/ModalContainer/ModalContainer";

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

  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/tracks')
  }

  return (
    <>
      <div className={styles.btn_container}>
        <Btn onClick={handleBack}>
          Назад
        </Btn>
      </div>
      <form className={styles.create_container} name="create_track">
        <div className={styles.inputs_container}>
          <Input
            onChange={name.onChange}
            onBlur={name.onBlur}
            placeholder="Введите название"
            value={name.value}
            isEmpty={name.isEmpty}
            setValue={name.setValue}
          />
          <Input
            onChange={artist.onChange}
            onBlur={artist.onBlur}
            placeholder="Введите исполнителя"
            value={artist.value}
            isEmpty={artist.isEmpty}
            setValue={artist.setValue}
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
      <Btn
        onClick={handleSubmit}
        disabled={!hasData}
        isLoading={isLoading}
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
  );
};

export default memo(CreateTrackForm);
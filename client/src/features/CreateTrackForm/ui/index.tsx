import {
  Btn,
  InputAudioFile,
  InputImageFile,
  ModalContainer,
  Options,
  UITextAreaField,
  UITextField,
} from '@/shared/ui';
import styles from './CreateTrackForm.module.scss';
import { useCreateTrackForm } from '../model/useCreateTrackForm';
import { SearchArtistInput } from '@/entities/artist';
import { ChangeEvent } from 'react';

export const CreateTrackForm = () => {
  const {
    name,
    artist,
    options,
    text,
    setCover,
    setAudio,
    handleSubmit,
    isLoading,
    hasData,
    modal,
    hideModal,
  } = useCreateTrackForm();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file?.name) {
        const str = file.name;
        str
          .split('.')
          .slice(0, -1)
          .join('.')
          .replace(/^[\d\s\-.,_]+/g, '')
          .trim()
          .replace(/^\w/, (c) => c.toUpperCase());
        name.setValue(str);
      }
    }
  };

  return (
    <>
      <form className={styles.form} name="create_track">
        <div className={styles.fields_container}>
          <UITextField label="Введите название" value={name.value} onChange={name.onChange} />
          <SearchArtistInput
            label="Введите или найдите исполнителя"
            artist={artist.value}
            setArtist={artist.setValue}
          />
          <Options
            options={options}
            //setOptions={setOptions}
            //setValue={genre.setValue}
            //value={genre.value}
          />
          <UITextAreaField
            value={text.value}
            onChange={text.onChange}
            placeholder="Введите текст песни"
          />
        </div>
        <div className={styles.fields_upload_container}>
          <div className={styles.input_cover}>
            <InputImageFile 
              placeholder="Загрузите обложку трека" 
              setFile={setCover} 
            />
          </div>
          <div className={styles.input_audio}>
            <InputAudioFile
              onChange={handleFileChange}
              placeholder="Загрузите аудиодорожку"
              setFile={setAudio}
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
      <ModalContainer hideModal={hideModal} modal={modal} />
    </>
  );
};

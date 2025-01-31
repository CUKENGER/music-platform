import styles from './CreateArtistForm.module.scss';
import {
  Btn,
  InputImageFile,
  ModalContainer,
  Options,
  UITextAreaField,
  UITextField,
} from '@/shared/ui';
import { PRIVATE_ROUTES } from '@/shared/consts';

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
    hideModal,
  } = useCreateArtistForm();

  return (
    <form className={styles.CreateArtistForm} onSubmit={handleSubmit}>
      <Link to={PRIVATE_ROUTES.ARTISTS}>
        <Btn>Назад</Btn>
      </Link>
      <UITextField value={name.value} onChange={name.onChange} placeholder="Введите имя исполнителя" />
      <UITextAreaField value={description.value} onChange={description.onChange} placeholder="Введите описание исполнителя" />
      <Options
        options={options}
        //setOptions={setOptions}
        //setValue={genre.setValue}
        //value={genre.value}
      />
      <InputImageFile
        placeholder="Загрузите обложку исполнителя"
        setFile={setPicture}
      />
      <Btn onClick={handleSubmit} isLoading={isLoading} disabled={!hasData}>
        Отправить
      </Btn>
      <ModalContainer hideModal={hideModal} modal={modal} />
    </form>
  );
};

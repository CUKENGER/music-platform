import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './EditArtistForm.module.scss';
import { useInput, useModal } from '@/shared/hooks';
import { useGetOneArtist, useUpdateArtist } from '@/entities/artist';
import { genres } from '@/shared/moks';
import { Btn, InputImageFile, ModalContainer, Options, UITextAreaField, UITextField } from '@/shared/ui';

export const EditArtistForm = () => {
  const { id } = useParams();
  const { modal, hideModal, showModal } = useModal();
  const navigate = useNavigate();

  const { data: artist } = useGetOneArtist(Number(id));
  const { mutate: updateArtist, isPending: isLoading } = useUpdateArtist(Number(id));

  const name = useInput(artist?.name || '', { isEmpty: true });
  const genre = useInput(artist?.genre || '', { isEmpty: true });
  const description = useInput(artist?.description || '', { isEmpty: true });
  const [picture, setPicture] = useState<File | null>(null);
  const [options, setOptions] = useState(genres);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!picture && !artist?.picture) {
      showModal('Загрузите изображение');
      return;
    }

    const artistDto = {
      name: name.value.trim(),
      description: description.value.trim(),
      genre: genre.value.trim(),
      picture: picture as File,
    };

    updateArtist(artistDto, {
      onSuccess: () => {
        showModal('Исполнитель успешно обновлен', () =>
          navigate(`${PRIVATE_ROUTES.ARTISTS}/${id}`),
        );
      },
      onError: () => {
        showModal('Произошла ошибка при обновлении исполнителя');
      },
    });
  };

  const hasData = name.value && genre.value && description.value;

  return (
    <form className={styles.form}>
      <Link to={`${PRIVATE_ROUTES.ARTISTS}/${id}`}>
        <Btn>Назад</Btn>
      </Link>
      <div className={styles.container}>
        <div className={styles.inputs_container}>
          <UITextField 
            value={name.value}
            onChange={name.onChange}
            placeholder="Введите имя исполнителя" 
          />
          <UITextAreaField 
            value={description.value}
            onChange={description.onChange}
            placeholder="Введите описание исполнителя" 
          />
          <Options
            options={options}
            // setOptions={setOptions}
            // setValue={genre.setValue}
            // value={genre.value}
          />
        </div>
        <div className={styles.picture_container}>
          <div className={styles.picture_input_container}>
            <InputImageFile
              placeholder="Загрузите обложку исполнителя"
              setFile={setPicture}
              currentPicture={API_URL + artist?.picture}
            />
          </div>
        </div>
      </div>
      <Btn onClick={handleSubmit} isLoading={isLoading} disabled={!hasData}>
        Отправить
      </Btn>
      <ModalContainer modal={modal} hideModal={hideModal} />
    </form>
  );
};

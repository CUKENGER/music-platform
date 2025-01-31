import { CreateAlbumDto, useCreateAlbum } from '@/entities/album';
import { PRIVATE_ROUTES } from '@/shared/consts';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CreateAlbumInputs } from '../ui';
import { useModal } from '@/shared/hooks';
import { useNavigate } from 'react-router-dom';

export const useSubmitForm = () => {
  const navigate = useNavigate();

  const { handleSubmit, setValue, getValues, control } = useForm<CreateAlbumInputs>({});
  const values = getValues();
  const { modal, showModal, hideModal } = useModal();

  const { isPending, mutate: createAlbum } = useCreateAlbum();
  const hasData = !!(
    values.name &&
    values.artist &&
    values.genre &&
    values.releaseDate &&
    values.cover &&
    values.tracks?.length &&
    values.tracks?.length > 0 &&
    values.tracks.every((track) => track.name.trim() && track.audio)
  );

  const onSubmit: SubmitHandler<CreateAlbumInputs> = () => {
    if (!hasData) {
      showModal('Заполните все данные, пожалуйста');
      return;
    }

    const track_names = values.tracks?.map((track) => track.name) || [];
    const track_texts = values.tracks?.map((track) => track.text) || [];

    const albumData: CreateAlbumDto = {
      name: values.name,
      artist: values.artist,
      genre: values.genre,
      description: values.description,
      picture: values.cover as File,
      tracks: values.tracks || [],
      track_names: track_names,
      track_texts: track_texts,
      releaseDate:
        values.releaseDate instanceof Date ?
          values.releaseDate.toISOString()
          : (values.releaseDate as string),
    };

    createAlbum(albumData, {
      onSuccess: (res) => {
        showModal(`Альбом ${res.name} успешно загружен`, () => navigate(PRIVATE_ROUTES.ALBUMS));
      },
      onError: (e) => {
        showModal(`Произошла ошибка при создании альбома ${e}`);
      },
    });
  };
};

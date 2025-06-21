import { CreateAlbumDto, useCreateAlbum } from '@/entities/album';
import { PRIVATE_ROUTES } from '@/shared/consts';
import { useModal } from '@/shared/hooks';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export interface TrackFormData {
  id?: string;
  name: string;
  text: string;
  audio: File | null;
}

export interface CreateAlbumFormData {
  name: string;
  artist: string;
  genre: string;
  description: string;
  cover: File | null;
  releaseDate: Date | string;
  tracks: TrackFormData[];
}

export const useCreateAlbumForm = () => {
  const navigate = useNavigate();
  const { modal, hideModal, showModal } = useModal();
  const { isPending, mutate: createAlbum } = useCreateAlbum();

  const methods = useForm<CreateAlbumFormData>({
    defaultValues: {
      name: '',
      artist: '',
      genre: '',
      description: '',
      cover: null,
      releaseDate: '',
      tracks: [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = methods;
  const { fields, append, remove, move } = useFieldArray({
    name: 'tracks',
    control,
  });

  const addTrack = () => {
    append({
      name: '',
      text: '',
      audio: null,
    });
  };

  const removeTrack = (index: number) => {
    remove(index);
  };

  const reorderTracks = (from: number, to: number) => {
    move(from, to);
  };

  const onSubmit: SubmitHandler<CreateAlbumFormData> = (data) => {
    if (!isValid || data.tracks.length < 1) {
      showModal('Заполните все обязательные поля');
      return;
    }

    const trackNames = data.tracks.map((track) => track.name);
    const trackTexts = data.tracks.map((track) => track.text);

    const albumData: CreateAlbumDto = {
      name: data.name,
      artist: data.artist,
      genre: data.genre,
      description: data.description,
      picture: data.cover as File,
      tracks: data.tracks,
      track_names: trackNames,
      track_texts: trackTexts,
      releaseDate:
        data.releaseDate instanceof Date ? data.releaseDate.toISOString() : data.releaseDate,
    };

    createAlbum(albumData, {
      onSuccess: (res) => {
        showModal(`Альбом ${res.name} успешно создан`, () => {
          navigate(PRIVATE_ROUTES.ALBUMS);
        });
      },
      onError: (error) => {
        showModal(`Ошибка при создании альбома: ${error.message || 'Неизвестная ошибка'}`);
      },
    });
  };

  return {
    methods,
    isPending,
    isValid,
    fields,
    addTrack,
    removeTrack,
    reorderTracks,
    onSubmit: handleSubmit(onSubmit),
    modal,
    showModal,
    hideModal,
  };
};

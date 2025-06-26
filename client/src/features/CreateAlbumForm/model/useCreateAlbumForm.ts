import { CreateAlbumDto, useCreateAlbum } from '@/entities/album';
import { PRIVATE_ROUTES } from '@/shared/consts';
import { useModal } from '@/shared/hooks';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TrackState } from '@/entities/track';

export interface TrackFormData {
  id: string;
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
  releaseDate: Date | null;
  tracks: TrackFormData[];
}

// Схема валидации
const trackSchema = yup.object({
  id: yup.string().required('ID трека обязателен'),
  name: yup.string().required('Название трека обязательно').min(1, 'Название не может быть пустым'),
  text: yup.string().default('').min(1, 'Текст песни не может быть пустым'),
  audio: yup
    .mixed<File>()
    .required('Аудиофайл обязателен')
    .test('is-file', 'Аудиофайл обязателен', (value) => value instanceof File),
});

const schema: yup.ObjectSchema<CreateAlbumFormData> = yup.object({
  name: yup
    .string()
    .required('Название альбома обязательно')
    .min(1, 'Название не может быть пустым'),
  artist: yup
    .string()
    .required('Исполнитель обязателен')
    .min(1, 'Исполнитель не может быть пустым'),
  genre: yup.string().required('Жанр обязателен').min(1, 'Жанр не может быть пустым'),
  description: yup
    .string()
    .required('Описание обязательно')
    .min(1, 'Описание не может быть пустым'),
  cover: yup
    .mixed<File>()
    .required('Обложка обязательна')
    .test('is-file', 'Обложка обязательна', (value) => value instanceof File),
  releaseDate: yup.date().required('Дата выхода обязательна').typeError('Дата выхода обязательна'),
  tracks: yup
    .array()
    .of(trackSchema)
    .min(1, 'Должен быть хотя бы один трек')
    .required('Треки обязательны')
    .test(
      'unique-track-names',
      'Треки не могут иметь одинаковые названия для одного артиста',
      (tracks, context) => {
        if (!tracks || tracks.length === 0) return true;
        const artist = context.parent.artist as string;
        if (!artist) return true;
        const trackNames = tracks.map((track) => track.name?.trim().toLowerCase());
        const uniqueTrackNames = new Set(trackNames);
        return uniqueTrackNames.size === trackNames.length;
      },
    ),
});

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
      releaseDate: null,
      tracks: [{ id: crypto.randomUUID(), name: '', text: '', audio: null }],
    },
    resolver: yupResolver<CreateAlbumFormData, unknown, CreateAlbumFormData>(schema),
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
    trigger,
  } = methods;
  const { fields, append, remove, move } = useFieldArray({
    name: 'tracks',
    control,
  });

  const addTrack = () => {
    append({
      id: crypto.randomUUID(),
      name: '',
      text: '',
      audio: null,
    });
    trigger();
  };

  const removeTrack = (id: string) => {
    const index = fields.findIndex((track) => track.id === id);
    if (fields.length > 1) {
      remove(index);
      trigger();
    } else {
      showModal('Нельзя удалить последний трек');
    }
  };

  const reorderTracks = (from: number, to: number) => {
    move(from, to);
    trigger();
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
      picture: data.cover!,
      tracks: data.tracks as TrackState[],
      track_names: trackNames,
      track_texts: trackTexts,
      releaseDate: data.releaseDate!.toISOString(),
    };

    console.log('album Form data:', albumData);

    // createAlbum(albumData, {
    //   onSuccess: (res) => {
    //     showModal(`Альбом ${res.name} успешно создан`, () => {
    //       navigate(PRIVATE_ROUTES.ALBUMS);
    //     });
    //   },
    //   onError: (error) => {
    //     showModal(`Ошибка при создании альбома: ${error.message || 'Неизвестная ошибка'}`);
    //   },
    // });
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
    errors,
  };
};

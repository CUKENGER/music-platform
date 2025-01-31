import { CreateAlbumDto, useCreateAlbum } from '@/entities/album';
import { TrackState } from '@/entities/track';
import { PRIVATE_ROUTES } from '@/shared/consts';
import { useDebounce, useModal } from '@/shared/hooks';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export type CreateAlbumInputs = {
  name: string;
  artist: string;
  genre: string;
  description: string;
  cover?: File | null;
  releaseDate: Date | string | undefined;
  tracks?: TrackState[];
};

export const useCreateAlbumForm = () => {
  const navigate = useNavigate();

  const { modal, showModal, hideModal } = useModal();

  const { handleSubmit, setValue, getValues } = useForm<CreateAlbumInputs>({});
  const values = getValues();

  const debouncedArtist = useDebounce(values.artist, 500);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newTracks = Array.from(selectedFiles).map((file) => ({
        name: file.name
          .split('.')
          .slice(0, -1)
          .join('.')
          .replace(/^[\d\s\-.,_]+/g, '')
          .trim()
          .replace(/^\w/, (c) => c.toUpperCase()),
        text: '',
        audio: file,
      }));
      setValue('tracks', newTracks);
    }
  };

  const addTrackForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const prevTracks = getValues('tracks') || [];
    setValue('tracks', [...prevTracks, { name: '', text: '', audio: null }]);
  };

  return {
    handleSubmit,
    onSubmit,
    isPending,
    modal,
    hideModal,
    handleFileChange,
    hasData,
    debouncedArtist,
    addTrackForm,
  };
};

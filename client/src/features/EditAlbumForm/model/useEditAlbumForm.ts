import { useGetOneAlbum, useUpdateAlbum } from '@/entities/album';
import { EditAlbumDto } from '@/entities/album/types/Album';
import { TrackUpdateState } from '@/entities/track';
import { PRIVATE_ROUTES } from '@/shared/consts';
import { useDebounce, useModal } from '@/shared/hooks';
import { useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

export type EditAlbumInputs = {
  name: string;
  artist: string;
  genre: string;
  description: string;
  cover?: File | null;
  releaseDate: Date | string | undefined;
  tracks?: TrackUpdateState[];
  deletedTracks?: TrackUpdateState[];
};

export const useEditAlbumForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: album } = useGetOneAlbum(Number(id));
  const { isPending, mutate: updateAlbum } = useUpdateAlbum();
  const { hideModal, modal, showModal } = useModal();

  const {
    handleSubmit,
    formState: { isValid, isDirty, dirtyFields, touchedFields },
    setValue,
    control,
    getValues,
  } = useForm<EditAlbumInputs>({
    defaultValues: {
      name: album?.name || '',
      artist: album?.artist.name || '',
      genre: album?.genre || '',
      description: album?.description || '',
      cover: null,
      releaseDate: album?.releaseDate ? new Date(album.releaseDate) : undefined,
      tracks:
        album?.tracks ?
          album.tracks.map((track) => ({
            id: track.id,
            name: track.name,
            text: track.text,
            audio: null,
            isUpdated: false,
            isNew: false,
            isExist: true,
          }))
        : [],
      deletedTracks: [],
    },
  });

  const values = getValues();
  const isChanged = useMemo(() => {
    return isDirty || Object.keys(dirtyFields).length > 0 || touchedFields;
  }, [isDirty, dirtyFields]);

  const invalidNewTracks = values?.tracks?.some(
    (track) => track.isNew && (!track.name.trim() || !track.audio),
  );

  const debouncedArtist = useDebounce(getValues('artist'), 500);

  const addTrackForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const prevTracks = getValues('tracks') || [];
    setValue('tracks', [
      ...prevTracks,
      {
        name: '',
        text: '',
        audio: null,
        isNew: true,
        isUpdated: false,
        isExist: false,
      },
    ]);
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
      setValue('tracks', newTracks as TrackUpdateState[]);
    }
  };

  const validateForm = () => {
    if (!isChanged) {
      showModal('Вы не внесли изменений');
      return false;
    }

    if (!isValid) {
      showModal('Заполните все поля');
      return false;
    }

    if (values?.tracks?.length === 0) {
      showModal('Добавьте хотя бы один трек');
      return false;
    }

    if (invalidNewTracks) {
      showModal('У новых треков должно быть название и аудиодорожка');
      return false;
    }

    return true;
  };

  const onSubmit: SubmitHandler<EditAlbumInputs> = (data) => {
    if (!validateForm()) {
      return;
    }

    if (data?.tracks?.length) {
      const albumInfo: EditAlbumDto = {
        name: data.name,
        artist: data.artist,
        genre: data.genre,
        description: data.description,
        releaseDate:
          data.releaseDate instanceof Date ?
            data.releaseDate.toISOString()
          : (data.releaseDate ?? ''),
        tracks: data?.tracks?.filter((track) => track.name || track.text || track.audio),
        track_names: data?.tracks.map((track) => track.name),
        track_texts: data?.tracks.map((track) => track.text),
        deletedTracks: data?.deletedTracks ?? [],
        picture: data?.cover ?? null,
      };

      updateAlbum(
        {
          id: Number(id),
          albumInfo,
        },
        {
          onSuccess: () => {
            showModal('Данные успешно отправлены', () =>
              navigate(PRIVATE_ROUTES.ALBUMS + `/${id}`),
            );
          },
          onError: () => {
            showModal('Произошла ошибка, повторите позже', () =>
              navigate(PRIVATE_ROUTES.ALBUMS + `/${id}`),
            );
          },
        },
      );
    }
  };

  console.log('isChanged', isChanged);

  return {
    album,
    isPending,
    handleSubmit,
    onSubmit,
    control,
    getValues,
    setValue,
    handleFileChange,
    addTrackForm,
    debouncedArtist,
    hideModal,
    modal,
  };
};

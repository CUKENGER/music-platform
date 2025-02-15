import { useCreateTrack } from '@/entities/track';
import { axiosInstance } from '@/shared/api';
import { API_URL, PRIVATE_ROUTES } from '@/shared/consts';
import { useInput, useModal, useDebounce } from '@/shared/hooks';
import { genres } from '@/shared/moks';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useCreateTrackForm = () => {
  const navigate = useNavigate();

  const name = useInput('', {});
  const artist = useInput('', {});
  const text = useInput('', {});
  const genre = useInput('', {});

  const [options, setOptions] = useState(genres);

  const { hideModal, modal, showModal } = useModal();

  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);

  const debouncedName = useDebounce(name.value, 500);
  const debouncedArtist = useDebounce(artist.value, 500);

  const { mutate: createTrack, isPending: isLoading } = useCreateTrack();

  useEffect(() => {
    const get = async () => {
      if (debouncedArtist && debouncedName) {
        try {
          const response = await axiosInstance.get(API_URL + 'lyrics/search', {
            params: { track_name: debouncedName, artist_name: debouncedArtist },
          });

          if (response.data.track_id) {
            const lyricsResponse = await axiosInstance.get(
              API_URL + `lyrics?track_id=${response.data.track_id}`,
            );
            text.setValue(lyricsResponse.data);
          }
        } catch (e) {
          console.error('Error in get lyrics', e);
        }
      }
    };
    get();
  }, [debouncedArtist, debouncedName, text]);

  const hasData = !!(
    name.value.trim() &&
    text.value.trim() &&
    artist.value.trim() &&
    // genre.value.trim() &&
    audio &&
    cover
  );

  const handleSubmit = async () => {
    if (!hasData) {
      showModal('Заполните все данные, пожалуйста');
      return;
    }

    if (hasData) {
      const trackInfo = {
        name: name.value.trim(),
        text: text.value.trim(),
        artist: artist.value.trim(),
        genre: genre.value.trim(),
        audio: audio,
        picture: cover,
      };
      console.log('trackInfo', trackInfo)
      createTrack(trackInfo, {
        onSuccess: (response) => {
          showModal(`Трек ${response.name} успешно загружен`, () =>
            navigate(PRIVATE_ROUTES.TRACKS),
          );
        },
        onError: (error: AxiosError) => {
          console.error(`Ошибка при загрузке трека: `, error);
          showModal(`Ошибка при загрузке трека: ${String(error.message)}`);
        },
      });
    }
  };

  return {
    name,
    artist,
    options,
    text,
    genre,
    setCover,
    setAudio,
    handleSubmit,
    isLoading,
    hasData,
    modal,
    hideModal,
  };
};

import { TrackState, useCreateAlbum } from "@/entities";
import { CreateAlbumDto } from "@/entities/album/types/Album";
import { useModal, useInput, genres, useDebounce, PrivateRoutes } from "@/shared";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useCreateAlbumForm = () => {

  const [tracks, setTracks] = useState<TrackState[]>([
    { name: '', text: '', audio: null },
  ]);

  const navigate = useNavigate()

  const { modal, showModal, hideModal } = useModal()

  const name = useInput('', { isEmpty: true })
  const artist = useInput('', { isEmpty: true })
  const genre = useInput('', { isEmpty: true })
  const description = useInput('', { isEmpty: true })
  const [cover, setCover] = useState<File | null>(null)
  const [options, setOptions] = useState(genres)
  const [releaseDate, setReleaseDate] = useState<Date | undefined>(undefined)

  const debouncedArtist = useDebounce(artist.value, 500);

  const { isPending, mutate: createAlbum } = useCreateAlbum()

  const addTrackForm = (e: React.MouseEvent) => {
    e.preventDefault();
    setTracks((prevTracks) => [...prevTracks, { name: '', text: '', audio: null }]);
  };

  const updateTrack = (index: number, field: keyof TrackState, value: string | File | null) => {
    setTracks((prevTracks) => {
      const newTracks = [...prevTracks];
      newTracks[index] = {
        ...newTracks[index],
        [field]: value,
      };
      return newTracks;
    });
  };

  const removeTrack = (index: number) => {
    setTracks((prevTracks) => prevTracks.filter((_, i) => i !== index));
  };

  const hasData = !!(
    name.value.trim() &&
    artist.value.trim() &&
    genre.value.trim() &&
    description.value.trim() &&
    releaseDate &&
    cover &&
    tracks.length > 0 &&
    tracks.every(track => track.name.trim() && track.text.trim() && track.audio)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasData) {
      showModal('Заполните все данные, пожалуйста')
      return
    }

    const track_names = tracks.map(track => track.name);
    const track_texts = tracks.map(track => track.text);

    const albumData: CreateAlbumDto = {
      name: name.value,
      artist: artist.value,
      genre: genre.value,
      description: description.value,
      picture: cover as File,
      tracks: tracks,
      track_names: track_names,
      track_texts: track_texts,
      releaseDate: releaseDate?.toISOString()
    };


    createAlbum(albumData, {
      onSuccess: (res) => {
        showModal(`Альбом ${res.name} успешно загружен`, () => navigate(PrivateRoutes.ALBUMS))
      },
      onError: (e) => {
        showModal(`Произошла ошибка при создании альбома ${e}`)
      }
    });
  };

  return {
    handleSubmit,
    name,
    artist,
    description,
    releaseDate,
    setReleaseDate,
    options, 
    setOptions,
    genre,
    setCover,
    cover,
    tracks,
    updateTrack,
    removeTrack,
    addTrackForm,
    isPending,
    modal,
    debouncedArtist,
    hideModal
  }
}
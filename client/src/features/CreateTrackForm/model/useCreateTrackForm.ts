import { useCreateTrack } from "@/entities"
import { useInput, genres, useDebounce, ApiUrl, useModal, axiosInstance } from "@/shared"
import { useEffect, useState } from "react"

export const useCreateTrackForm = () => {

  const name = useInput('', {})
  const artist = useInput('', {})
  const text = useInput('', {})
  const genre = useInput('', {})

  const [options, setOptions] = useState(genres)

  const {hideModal, modal, showModal} = useModal()

  const [audio, setAudio] = useState<File | null>(null)
  const [cover, setCover] = useState<File | null>(null)

  const debouncedName = useDebounce(name.value, 500);
  const debouncedArtist = useDebounce(artist.value, 500);

  const {mutate: createTrack, isPending: isLoading,} = useCreateTrack()

  useEffect(() => {
    if (audio?.name) {
      const str = audio.name;
      const word = str.split('.').slice(0, -1).join('.');
      name.setValue(word);
    } else {
      name.setValue('');
    }
  }, [audio]);

  useEffect(() => {
    const get = async () => {
      if( debouncedArtist && debouncedName) {
        try {
          const response = await axiosInstance.get(ApiUrl + 'lyrics/search', {
            params: {track_name: debouncedName, artist_name: debouncedArtist}
          });
          console.log('response', response)
          
          if (response.data.track_id) {
            const lyricsResponse = await axiosInstance.get(ApiUrl + `lyrics?track_id=${response.data.track_id}`);
            console.log('lyricsResponse',lyricsResponse.data)
            text.setValue(lyricsResponse.data)
          }
        } catch(e) {
          console.error('Error in get', e)
        }
      }
    }
    get()
  }, [debouncedArtist, debouncedName])

  const hasData = !!(
    name.value.trim() &&
    text.value.trim() &&
    artist.value.trim() &&
    genre.value.trim() &&
    audio &&
    cover
  );

  const handleSubmit = async () => {

    if(!hasData) {
      showModal('Заполните все данные пожалуйста')
      return
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
      createTrack(trackInfo, {
        onSuccess: (response) => {
          showModal(`Трек ${response.name} успешно загружен`)
          name.setValue('');
          artist.setValue('');
          text.setValue('');
          genre.setValue('');
          setAudio(null);
          setCover(null);
        },
        onError: (error: unknown) => {
          showModal(`Ошибка при загрузке трека: ${String(error)}`);
        },
      })
    } 
  }

  return {
    name,
    artist,
    options,
    setOptions,
    genre,
    text,
    setCover,
    cover,
    setAudio,
    audio,
    handleSubmit,
    isLoading,
    hideModal, 
    modal,
    hasData
  }

}
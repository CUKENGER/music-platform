import { useCreateTrackMutation } from "@/api/Track/TrackService"
import useDebounce from "@/hooks/useDebounce"
import { useInput } from "@/hooks/useInput"
import { genres } from "@/services/genres"
import { apiUrl } from "@/shared/config/apiUrl"
import useModal from "@/shared/hooks/useModal"
import axios from "axios"
import { useEffect, useState } from "react"


const useCreateTrackForm = () => {
  const { hideModal, modal, showModal } = useModal()

  const name = useInput('', { isEmpty: true })
  const artist = useInput('', { isEmpty: true })
  const text = useInput('', { isEmpty: true })
  const genre = useInput('', { isEmpty: true })

  const [audio, setAudio] = useState<File | null>(null)
  const [cover, setCover] = useState<File | null>(null)

  const [options, setOptions] = useState(genres) 

  const debouncedName = useDebounce(name.value, 500);
  const debouncedArtist = useDebounce(artist.value, 500);

  const [createTrack, { isLoading }] = useCreateTrackMutation()

  useEffect(() => {
    if (audio?.name) {
      const str = audio.name;
      const match = str.match(/\.(.*)\./);
      if (match && match[1]) {
        const word = match[1].trim();
        name.setValue(word);
      } else {
        name.setValue(''); // Обработка случая, когда нет совпадений
      }
    }
  }, [audio]);

  useEffect(() => {
    const get = async () => {
      if( debouncedArtist && debouncedName) {
        try {
          const response = await axios.get(apiUrl + 'lyrics/search', {
            params: {track_name: debouncedName, artist_name: debouncedArtist}
          });
          
          if (response.data.track_id) {
            const lyricsResponse = await axios.get(apiUrl + `lyrics?track_id=${response.data.track_id}`);
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
    const fd = new FormData()
    if (hasData) {
      fd.append('name', name.value.trim())
      fd.append('text', text.value.trim())
      fd.append('artist', artist.value.trim())
      fd.append('genre', genre.value.trim())
      fd.append('audio', audio)
      fd.append('picture', cover)

      await createTrack(fd).unwrap()
        .then((response) => {
          console.log('res', response)
          showModal(`Трек ${response.name} успешно загружен`)
        }
        )
        .catch((e) => console.log('e', e))

    } else {
      console.log('хуй в твоей жопе застрял надолго');
      showModal('хуй в твоей жопе застрял надолго')
    }

  }

  return {
    name,
    artist,
    text,
    genre,
    audio,
    cover,
    handleSubmit,
    hideModal,
    modal,
    hasData,
    setAudio,
    setCover,
    isLoading,
    options,
    setOptions
  }
}

export default useCreateTrackForm
import { useCreateTrackMutation } from "@/api/Track/TrackService"
import { useInput } from "@/hooks/useInput"
import useModal from "@/hooks/useModal"
import { useEffect, useState } from "react"


const useCreateTrackForm = () => {
  const { hideModal, modal, showModal } = useModal()

  const name = useInput('', { isEmpty: true })
  const artist = useInput('', { isEmpty: true })
  const text = useInput('', { isEmpty: true })
  const genre = useInput('', { isEmpty: true })

  const [audio, setAudio] = useState<File | null>(null)
  const [cover, setCover] = useState<File | null>(null)

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
    isLoading
  }
}

export default useCreateTrackForm
import { useRouter } from "next/router"
import { useInput } from "../../hooks/useInput"
import { ChangeEvent, useCallback, useState } from "react"
import { genres } from "@/services/genres"
import { ITrack } from "@/types/track"
import useModal from "../../hooks/useModal"
import { useCreateAlbumMutation } from "@/api/Album/AlbumService"

interface IResult {
  id: number,
  name: string
}

const useCreateAlbum = () => {
  const router = useRouter()
  const name = useInput('')
  const artist = useInput('')
  const genre = useInput('')
  const releaseDate = useInput('')
  const description = useInput('')
  const [isErrorModal, setIsErrorModal] = useState(false)
  const [isNeedInput, setIsNeedInput] = useState(false)
  const [options, setOptions] = useState<string[]>(genres);
  const {showModal, hideModal, modal} = useModal()

  const [createAlbumMutation, {isLoading}] = useCreateAlbumMutation()

  const [tracks, setTracks] = useState<ITrack[]>([{
    id: 0, likes: 0,
    name: '', audio: '',
    artist: artist.value,
    listens: 0,
    picture: '',
    text: '',
    comments: []
  }]);

  const [cover, setCover] = useState<File | null>()

  const checkInputs = name.value.trim() && artist.value.trim() && releaseDate.value.trim() && description.value.trim() && genre.value.trim()

  const handleCreate = async () => {
    const formData = new FormData()
    if (checkInputs && tracks && cover) {
      formData.append('name', name.value.trim())
      formData.append('artist', artist.value.trim())
      formData.append('genre', genre.value.trim())
      formData.append('releaseDate', releaseDate.value.trim())
      formData.append('description', description.value.trim())
      formData.append('picture', cover)

      tracks.forEach((track, index) => {
        if (track.audio) {
          formData.append('tracks', track.audio)
          formData.append(`track_names`, track.name);
          formData.append(`track_texts`, track.text);
        }
      })

      try {
        const response = await createAlbumMutation(formData).unwrap()
          .then((result: IResult) => showModal(`Альбом с id ${result} успешно создан`))
          .catch((e:any) => showModal(`Произошла ошибка при создании альбома \n ${e}`))
          .finally(() => {
            showModal('Альбом успешно создан', () => {
              router.push('/albums')
            })
          })
      } catch (e) {
        showModal(`Произошла неизвестная ошибка \n ${e}`)
      }
    } else {
      showModal('Заполните все данные, пожалуйста')
    }
  }

  const handleInputDateChange = useCallback((e:ChangeEvent<HTMLInputElement>)=> {
    releaseDate.setValue(e.target.value)
  }, [releaseDate] )

  const handleAddInput = () => {
    setIsNeedInput(!isNeedInput)
  }

  return {
    showModal,
    hideModal,
    modal,
    handleInputDateChange,
    handleAddInput,
    handleCreate,
    name, 
    artist,
    isNeedInput,
    releaseDate,
    genre,
    options,
    setOptions,
    description,
    setCover,
    tracks,
    setTracks,
    isLoading
  }

}

export default useCreateAlbum
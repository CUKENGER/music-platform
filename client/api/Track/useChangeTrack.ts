import { useInput } from "@/hooks/useInput"
import useModal from "@/hooks/useModal"
import { useState } from "react"
import { useUpdateTrackMutation } from "./TrackService"
import { useTypedSelector } from "@/hooks/useTypedSelector"
import { genres } from "@/services/genres"
import { useRouter } from "next/router"
import { IError, ITrack } from "@/types/track"


const useChangeTrack = () => {
  const router = useRouter()
  const {openedTrack } = useTypedSelector(state=> state.playerReducer)
  const {hideModal, modal, showModal} = useModal()
  const name = useInput(openedTrack?.name ?? '')
  const text = useInput(openedTrack?.text ?? '')
  const artist = useInput(openedTrack?.artist ?? '')
  const genre = useInput(openedTrack?.genre ?? '')
  const [cover, setCover] = useState<File | null | string>(null)
  const [audio, setAudio] = useState<File>()
  const [options, setOptions] = useState(genres)
  const [updateTrack, {isLoading}] = useUpdateTrackMutation()

  const handleChange = async () => {
    if (!name.value.trim() || !text.value.trim() || !genre.value || !artist.value.trim()) {
			showModal('Заполните все данные, пожалуйста')
			return
		}
    const fd = new FormData()
    if (cover) {
      fd.append('picture', cover)
    }
    if (audio) {
      fd.append('audio', audio)
    }
    fd.append('name', name.value.trim())
    fd.append('genre', genre.value.trim())
    fd.append('text', text.value)
    fd.append('id', (openedTrack?.id ?? 0).toString())
    fd.append('likes', '0')
    fd.append('listens', '0')

    const updateTrackData = {
			id: openedTrack?.id ?? 0,
			data: fd
		} 

    try {
			await updateTrack(updateTrackData).unwrap() 
				.then((response:ITrack) => {
					showModal(`Track with name ${response.name} changed successfully`, () => {
						router.push('/tracks/' + response.id)
					})
				})
				.catch((error:IError) => {
					showModal(`Произошла ошибка: \n ${error.data.message}`, () => {
						router.push('/tracks')
					})
				})
				.finally(() => {
					console.log('The artist change is complete');
				})
		} catch (e) {
			showModal(`Произошла неизвестная ошибка`, () => {
				router.push('/tracks')
			})
		}
  }

  return {
    name,
    artist,
    text,
    options,
    setOptions,
    genre,
    setCover,
    setAudio,
    handleChange,
    isLoading,
    modal,
    hideModal,
  }
}
export default useChangeTrack
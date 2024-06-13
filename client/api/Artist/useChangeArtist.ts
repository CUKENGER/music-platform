import { useInput } from "@/hooks/useInput";
import useModal from "@/hooks/useModal";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { genres } from "@/services/genres";
import { useRouter } from "next/router";
import { useState } from "react";
import { useUpdateArtistMutation } from "./ArtistService";
import { baseUrl } from "@/services/baseUrl";
import { IArtist } from "@/types/track";

interface IError{
	data: {
		message: string,
		statusCode: number
	};
	status:number
}

const useChangeArtist = () => {

  const [options, setOptions] = useState<string[]>(genres);
	const { showModal, hideModal, modal } = useModal()
  const {openedArtist} = useTypedSelector(state=> state.searchArtistsReducer)
	const router = useRouter()
  
	const name = useInput(openedArtist ? openedArtist?.name : '')
	const description = useInput(openedArtist ? openedArtist?.description : '')
	const genre = useInput(openedArtist ? openedArtist?.genre : '')
	const [cover, setCover] = useState<File | null | string>(null)
	const currentPicture = openedArtist?.picture ? baseUrl + openedArtist.picture : null;
	const currentGenre = openedArtist?.genre
 
	const [updateArtist, {isLoading}] = useUpdateArtistMutation()

	const handleCreate = async () => {
		if (!name.value.trim() || !description.value.trim() || !genre.value) {
			showModal('Заполните все данные, пожалуйста')
			return
		}
		const fd = new FormData()
		if (cover) {
			fd.append('name', name.value.trim())
			fd.append('genre', genre.value.trim())
			fd.append('description', description.value.trim())
			fd.append('picture', cover)
			fd.append('id', (openedArtist?.id ?? 0).toString())
			fd.append('likes', '0')
			fd.append('listens', '0')
		} else{
			fd.append('name', name.value.trim())
			fd.append('genre', genre.value.trim())
			fd.append('description', description.value.trim())
			fd.append('id', (openedArtist?.id ?? 0).toString())
			fd.append('likes', '0')
			fd.append('listens', '0')
		}
		
		const updateArtistData = {
			id: openedArtist?.id ?? 0,
			data: fd
		} 
		 
		try {
			await updateArtist(updateArtistData).unwrap() 
				.then((response:IArtist) => {
					showModal(`Artist with name ${response.name} changed successfully`, () => {
						router.push('/artists')
					})
				})
				.catch((error:IError) => {
					showModal(`Произошла ошибка: \n ${error.data.message}`, () => {
						router.push('/artists')
					})
				})
				.finally(() => {
					console.log('The artist change is complete');
				})
		} catch (e) {
			showModal(`Произошла неизвестная ошибка`, () => {
				router.push('/artists')
			})
		}

	}
  return {
    openedArtist,
    router,
    name,
    genre,
    currentGenre,
    setOptions,
    options,
    description,
    currentPicture,
    setCover,
    handleCreate,
    isLoading,
    modal,
    hideModal
  }

}

export default useChangeArtist
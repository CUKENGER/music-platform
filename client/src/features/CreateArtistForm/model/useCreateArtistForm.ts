import { useCreateArtist } from "@/entities"
import { useInput, genres, useModal, PrivateRoutes } from "@/shared"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


interface ErrorResponse {
  response: {
    data: {
      message: string
    }
  }
}

export const useCreateArtistForm = () => {

  const name = useInput('', { isEmpty: true })
  const genre = useInput('', { isEmpty: true })
  const description = useInput('', { isEmpty: true })
  const [picture, setPicture] = useState<File | null>(null)
  const [options, setOptions] = useState(genres)
  const {hideModal, modal, showModal} = useModal()
  const navigate = useNavigate()

  const hasData = !!(
    description.value.trim() &&
    name.value.trim() &&
    genre.value.trim() &&
    picture
  );

  const {isPending: isLoading, mutate: createArtist} = useCreateArtist()

  const handleSubmit = () => {
    if (!hasData) {
      showModal('Заполните все данные, пожалуйста')
      return
    }

    const artistDto = {
      name: name.value.trim(),
      description: description.value.trim(),
      genre: genre.value.trim(),
      picture: picture
    }

    createArtist(artistDto, {
      onSuccess: (res) => {
        showModal(`Артист ${res.name} успешно создан`,() => {
          navigate(PrivateRoutes.ARTISTS)
        })
      },
      onError: (e: ErrorResponse | Error) => {
        if ('response' in e && e.response?.data?.message) {
          showModal(`Произошла ошибка: ${e.response.data.message}`);
        } 
        else if (e instanceof Error) {
          showModal(`Произошла ошибка: ${e.message}`);
        } 
        else {
          showModal('Произошла неизвестная ошибка');
        }
      }
    })

  }

  return {
    name,
    description,
    options, 
    setOptions,
    genre,
    setPicture,
    picture,
    handleSubmit,
    isLoading,
    hasData,
    modal,
    hideModal
  }

}
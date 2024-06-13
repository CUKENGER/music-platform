import { useInput } from "@/hooks/useInput";
import { genres } from "@/services/genres";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useCreateArtistMutation } from "./ArtistService";
import useModal from "@/hooks/useModal";



const useCreateArtist = () => {
  const [options, setOptions] = useState<string[]>(genres);
  const { showModal, hideModal, modal } = useModal()
  const [cover, setCover] = useState<File | null>(null)
  const router = useRouter()

  const name = useInput('')
  const description = useInput('')
  const genre = useInput('')

  const [createArtist, { isLoading }] = useCreateArtistMutation()

  const checkInputs = name.value.trim() || description.value.trim() && genre.value.trim()

  const handleCreate = async () => {
    if (!checkInputs && !cover) {
      showModal('Заполните все данные, пожалуйста')
      return
    }

    const fd = new FormData()
    fd.append('name', name.value);
    fd.append('genre', genre.value);
    fd.append('description', description.value);
    if (cover) {
      fd.append('picture', cover);
    } else {
      showModal('Загрузите обложку')
    }

    try {
      await createArtist(fd).unwrap()
        .then((response) => {
          showModal(`Artist with name ${response.name} creates successfully`)
        })
        .catch((error) => {
          showModal(`Произошла ошибка: \n ${error.data.message}`)
        })
        .finally(() => {
          showModal('Артист успешно создан');
        })
    } catch (e) {
      showModal(`Произошла неизвестная ошибка`)
    }
  }

  return {
    handleCreate,
    router,
    showModal,
    modal,
    hideModal,
    name, description,
    genre,
    options,
    setOptions,
    setCover,
    isLoading
  }
}

export default useCreateArtist
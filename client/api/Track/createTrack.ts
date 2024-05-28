import useActions from "@/hooks/useActions";
import { useInput } from "@/hooks/useInput";
import { StaticImageData } from "next/image";
import { useState } from "react";
import { useCreateTrackMutation } from "./TrackService";
import { toFile } from "@/services/downloadImage";
import { useRouter } from "next/router";
import useModal from "@/hooks/useModal";


export const useCreateTrack = () => {
    const router = useRouter()
    const [picture, setPicture] = useState<File | null | StaticImageData>(null);
    const [audio, setAudio] = useState<File | null>(null);

    const {hideModal, modal, showModal} = useModal()
    const { setUploadPicture } = useActions();

    const name = useInput('');
    const artist = useInput('');
    const text = useInput('');
    const genre = useInput('');

    const [createTrackMutation, {}] = useCreateTrackMutation();

    let file: File | null = null;

    const checkValues = name.value.trim() !== '' && artist.value.trim() !== '' && audio && text.value.trim() !== '' && genre.value.trim() !== ''

    const checkFirstValues = name.value.trim() !== '' && artist.value.trim() !== '' && text.value.trim() !== '' && genre.value.trim() !== ''

    const handleCreate = async (formData: any) => {
        if (checkValues) {
            formData.append('name', name.value.trim());
            formData.append('artist', artist.value.trim());
            formData.append('text', text.value.trim());
            formData.append('genre', genre.value.trim());
            formData.append('audio', audio);
            
            if (picture instanceof File) {
                formData.append('picture', picture);
            } else {
                if (!file) {
                    await toFile();
                }
                formData.append('picture', file);
            }
    
            try {
                const response = await createTrackMutation(formData).unwrap()
                showModal(`Трек с названием ${response.name} создан`, () => {
                    setUploadPicture('');
                    router.push('/tracks')
                });
                
            } catch (error) {
                console.error('Error creating track:', error);
                showModal("Произошла неизвестная ошибка", () => {
                    router.push('/tracks')
                });
            }
        } else {
            console.error('Missing required data');
            showModal("Заполните все необходимые поля");
        }
    };

    return{
        handleCreate,
        name,
        artist,
        genre,
        text,
        setPicture,
        audio,
        setAudio,
        modal,
        checkFirstValues,
        showModal,
        hideModal
    }

}


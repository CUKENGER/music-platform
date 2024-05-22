import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useCreateArtistMutation } from '@/api/ArtistService';

interface IModal {
    isOpen: boolean;
    message: string;
}

const useCreateArtist = (name: string, genre: string, description: string, cover: File | null) => {
    const [modal, setModal] = useState<IModal>({ isOpen: false, message: '' });
    const [createArtistMutation, { isLoading, error }] = useCreateArtistMutation();
    const router = useRouter();

    const handleCreate = useCallback(async () => {
        if (!name.trim() || !genre.trim() || !description.trim() || !cover) {
            setModal({
                isOpen: true,
                message: 'Заполните все данные, пожалуйста'
            });
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('genre', genre);
        formData.append('description', description);
        formData.append('picture', cover);

        try {
            const response = await createArtistMutation(formData).unwrap();
            setModal({
                isOpen: true,
                message: `Артист с именем ${response.data.name} успешно создан`
            });
        } catch (e) {
            if (error && 'error' in error && error.data) {
                console.log(error.data);
                
                if (error.data.message === 'Artist with this name already exists') {
                    setModal({
                        isOpen: true,
                        message: 'Артист с таким именем уже существует'
                    });
                    return;
                }
            }
            console.error(e);
            setModal({
                isOpen: true,
                message: 'Произошла неизвестная ошибка, попробуйте еще раз'
            });
        }
    }, [name, genre, description, cover, createArtistMutation, router]);

    return { handleCreate, isLoading, modal, setModal };
};

export default useCreateArtist;

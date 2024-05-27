import InputString from "@/UI/InputString/InputString";
import MainLayout from "@/layouts/MainLayout";
import { memo, useCallback, useState } from "react";
import styles from '@/styles/CreateArtist.module.css'
import { useInput } from "@/hooks/useInput";
import Textarea from "@/UI/Textarea/Textarea";
import ImageInput from "@/UI/ImageInput/ImageInput";
import ModalContainer from "@/UI/ModalContainer/ModalContainer";
import { useRouter } from "next/router";
import Btn from "@/UI/Btn/Btn";
import CheckInput from "@/UI/CheckInput/CheckInput";
import { genres } from "@/services/genres";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import { useCreateArtistMutation } from "@/api/ArtistService";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { baseUrl } from "@/services/baseUrl";

const ChangeArtist = () => {

    const [options, setOptions] = useState<string[]>(genres);
    const [modal, setModal] = useState({isOpen:false, message: ''});
    
    const router = useRouter()

    const {openedArtist} = useTypedSelector(state => state.searchArtistsReducer)

    const name = useInput(openedArtist ? openedArtist?.name : '')
    const description = useInput(openedArtist ? openedArtist?.description : '')
    const genre = useInput(openedArtist ? openedArtist?.genre : '')
    const [cover, setCover] = useState<File | null | string>(openedArtist?.picture ? baseUrl + openedArtist.picture : null)

    const handleCreate = useCallback(async () => {
        console.log('name.value', name.value);
        console.log('genre.value', genre.value);
        console.log('description.value', description.value);
        console.log('cover', cover);
        if (!name.value.trim() || !description.value.trim() || !genre.value || !cover) {
            setModal({
                isOpen: true,
                message: 'Заполните все данные, пожалуйста'
            })
            return 
        }

        const fd = new FormData()
        fd.append('name', name.value);
        fd.append('genre', genre.value);
        fd.append('description', description.value);
        fd.append('picture', cover);

        try {
            // await createArtist(fd).unwrap()
            //     .then((response) => {
            //         setModal({
            //             isOpen: true,
            //             message: `Artist with name ${response.name} creates successfully`
            //         })
            //     })
            //     .catch((error) => {
            //         setModal({
            //             isOpen: true,
            //             message: `Произошла ошибка: \n ${error.data.message}`
            //         })
            //     })
            //     .finally(() => {
            //         console.log('created artist vse');
            //     })
        } catch(e) {
            setModal({
                isOpen: true,
                message: `Произошла неизвестная ошибка`
            })
        }

    }, [name.value, description.value, genre.value, cover])

    return (
        <ErrorBoundary>
            <MainLayout title_text="Добавление исполнителя">
                <div className={styles.container}>
                    <div className={styles.btn_container}>
                        <Btn onClick={() => router.back()}>Назад</Btn>
                    </div>
                    <div className={styles.mainInfo_container}>
                        <div className={styles.inputs_container}>

                            <InputString
                                value={name.value}
                                setValue={name.setValue}
                                placeholder='Введите имя исполнителя'
                                isRequired={true}
                            />
                            <div className={styles.SelectInput_container}>
                                <CheckInput 
                                    options={options}
                                    setOptions={setOptions}
                                    setValue={genre.setValue}
                                />
                            </div>
                            <Textarea
                                value={description.value}
                                setValue={description.setValue}
                                placeholder='Введите описание к исполнителю'
                                isRequired={true}
                                onChangeNeed={true}
                            />
                            
                        </div>
                        <div className={styles.inputPhoto_container}>
                            <div>
                                <p>Загрузите обложку артиста</p>
                            </div>
                            <div className={styles.ImageInput_container}>
                                <ImageInput
                                    setPicture={setCover}
                                    placeholder='Выберите файл'
                                />
                            </div>
                        </div>
                    </div>
                    <button className={styles.nextBtn} onClick={handleCreate}>
                        {/* {isLoading &&(<span className={styles.loader}></span>)} */}
                        Отправить
                    </button>
                    {modal.isOpen && (
                        <ModalContainer text={modal.message} setState={() => setModal({ isOpen: false, message: '' })} onClick={() => router.push('/artists')}/>
                    )}
                </div>
            </MainLayout>
        </ErrorBoundary>
    )
}

ChangeArtist.displayName = 'ChangeArtist';

export default memo(ChangeArtist);
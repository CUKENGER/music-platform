import InputString from "@/UI/InputString/InputString";
import MainLayout from "@/layouts/MainLayout";
import { ChangeEvent, memo, useCallback, useState } from "react";
import styles from '@/styles/CreateArtist.module.css'
import { useInput } from "@/hooks/useInput";
import Textarea from "@/UI/Textarea/Textarea";
import ImageInput from "@/UI/ImageInput/ImageInput";
import ModalContainer from "@/UI/ModalContainer/ModalContainer";
import { useCreateArtistMutation } from "@/api/ArtistService";
import { useRouter } from "next/router";
import Btn from "@/UI/Btn/Btn";
import CheckInput from "@/UI/CheckInput/CheckInput";

const CreateArtist = memo(() => {

    const router = useRouter()
    
    const name = useInput('')
    const description = useInput('')
    const genre = useInput('')

    const [date, setDate] = useState<Date | null>(null)

    const [cover, setCover] = useState<File | null>(null)
    const [isErrorModal, setIsErrorModal] = useState(false)

    const [createArtistMutation, {isError, isLoading, reset}] = useCreateArtistMutation()

    const handleCreate = useCallback(async () => {
        const formData = new FormData()
        console.log('name' , name.value);
        console.log('genre' , genre.value);
        console.log('description' , description.value);
        console.log('cover' , cover);
        
        if (name && genre && description && cover) {
            formData.append('name', name.value)
            formData.append('genre', genre.value)
            formData.append('description', description.value)
            formData.append('picture', cover)

            try {
                const response = await createArtistMutation(formData)
                console.log('Response data:', response);
                console.log('Отправлено');
                router.push('/artists')
            } catch (e) {
                console.error('Error creating album:', e);
            }
        } else{
            setIsErrorModal(true)
        }
    }, [cover])

    const handleDate = (e:ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.valueAsDate)
        console.log(date);
    }

    return (
        <MainLayout title_text="Добавление исполнителя">
            <div className={styles.container}>
                <div className={styles.btn_container}>
                    <Btn onClick={() => router.push('/artists')}>Назад</Btn>
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
                            <CheckInput setValue={genre.setValue}/>
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
                    {isLoading &&(<span className={styles.loader}></span>)}
                    Отправить
                </button>
                {isErrorModal && (
                    <ModalContainer text='Заполните все данные, пожалуйста' setState={setIsErrorModal}/>
                )}
                
            </div>
        </MainLayout>
    )
})

export default CreateArtist
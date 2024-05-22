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
import useCreateArtist from "@/hooks/useCreateArtist";

const CreateArtist = memo(() => {

    const [options, setOptions] = useState<string[]>(genres);
    const [cover, setCover] = useState<File | null>(null)
    const router = useRouter()
    
    const name = useInput('')
    const description = useInput('')
    const genre = useInput('')

    const { handleCreate, isLoading, modal, setModal } = useCreateArtist(name.value, genre.value, description.value, cover);

    return (
        <ErrorBoundary>
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
                        {isLoading &&(<span className={styles.loader}></span>)}
                        Отправить
                    </button>
                    {modal.isOpen && (
                        <ModalContainer text={modal.message} setState={() => setModal({ isOpen: false, message: '' })} onClick={() => router.push('/artists')}/>
                    )}
                </div>
            </MainLayout>
        </ErrorBoundary>
    )
})

export default CreateArtist
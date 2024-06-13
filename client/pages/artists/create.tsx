import InputString from "@/UI/InputString/InputString";
import MainLayout from "@/layouts/MainLayout";
import { memo} from "react";
import styles from '@/styles/CreateArtist.module.css'
import Textarea from "@/UI/Textarea/Textarea";
import ImageInput from "@/UI/ImageInput/ImageInput";
import ModalContainer from "@/UI/ModalContainer/ModalContainer";
import Btn from "@/UI/Btn/Btn";
import CheckInput from "@/UI/CheckInput/CheckInput";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import useCreateArtist from "@/api/Artist/useCreateArtist";

const CreateArtist = () => {
    const {
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
    } = useCreateArtist()

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
                                    value={genre.value}
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
                        <ModalContainer 
                            text={modal.message} 
                            hideModal={hideModal}
                            onClick={modal.onClick}
                        />
                    )}
                </div>
            </MainLayout>
        </ErrorBoundary>
    )
}

CreateArtist.displayName = 'CreateArtist';

export default memo(CreateArtist);
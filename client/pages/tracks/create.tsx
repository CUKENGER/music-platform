'use client'

import MainLayout from "@/layouts/MainLayout";
import { memo, useState } from "react";
import styles from '@/styles/CreateTrack.module.css';
import { useRouter } from "next/router";
import { useInput } from "@/hooks/useInput";
import { StaticImageData } from "next/image";
import useActions from "@/hooks/useActions";
import { baseUrl } from "@/services/baseUrl";
import { useCreateTrackMutation } from "@/api/TrackService";
import StepWrapper from "@/components/Tracks/Create/StepWrapper/StepWrapper";
import Textarea from "@/UI/Textarea/Textarea";
import InputString from "@/UI/InputString/InputString";
import TrackFileUpload from "@/components/Tracks/Create/TrackFileUpload/TrackFileUpload";
import ModalContainer from "@/UI/ModalContainer/ModalContainer";
import SearchInput from "@/UI/SearchInput/SearchInput";
import Btn from "@/UI/Btn/Btn";
import TrackCoverUpload from "@/components/Tracks/Create/TrackCoverUpload/TrackCoverUpload/TrackCoverUpload";
import CheckInput from "@/UI/CheckInput/CheckInput";
import { genres } from "@/services/genres";

const Create = memo(() => {
    const [activeStep, setActiveStep] = useState<number>(1);
    const [picture, setPicture] = useState<File | null | StaticImageData>(null);
    const [audio, setAudio] = useState<File | null>(null);
    const [isNeedInput, setIsNeedInput] = useState(false);
    const [isNeedModal, setIsNeedModal] = useState(false);
    const [options, setOptions] = useState<string[]>(genres);
    const [modalText, setModalText] = useState<string>('');

    const { setUploadPicture } = useActions();

    const name = useInput('');
    const artist = useInput('');
    const text = useInput('');
    const genre = useInput('');

    const [createTrackMutation] = useCreateTrackMutation();

    const router = useRouter();

    const handleAddInput = () => {
        setIsNeedInput(!isNeedInput);
    };

    let file: File | null = null;

    const toFile = async () => {
        try {
            const response = await fetch(baseUrl + 'image/iscover.jpg');
            const blob = await response.blob();
            file = new File([blob], 'cover.jpg', { type: blob.type, lastModified: Date.now() });
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (formData: any) => {
        if (name.value.trim() !== '' && artist.value.trim() !== '' && audio && text.value.trim() !== '') {
            formData.append('name', name.value);
            formData.append('artist', artist.value);
            formData.append('text', text.value);
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
                const response = await createTrackMutation(formData);
                await router.push('/tracks');
                console.log(response);
                setUploadPicture('');
            } catch (error) {
                console.error('Error creating track:', error);
            }
        } else {
            console.error('Missing required data');
            console.log('Missing required data');
            setModalText('Заполните все обязательные поля');
            setIsNeedModal(true);
        }
    };

    const next = async () => {
        if (activeStep < 3) {
            if (name.value.trim() !== '' && artist.value.trim() !== '' && text.value.trim() !== '' && genre.value.trim() !== '') {
                setActiveStep(prev => prev + 1);
            } else {
                setModalText('Заполните необходимые поля');
                setIsNeedModal(true);
            }
        } else {
            const formData = new FormData();
            await handleCreate(formData);
        }
    };

    const back = () => {
        if (activeStep > 1) {
            setActiveStep(prev => prev - 1);
        }
    };

    return (
        <MainLayout title_text="Добавление трека">
            <StepWrapper setActiveStep={setActiveStep} activeStep={activeStep} nameInput={name.value} artistInput={artist.value}>
                {activeStep === 1 && (
                    <div className={styles.container}>
                        <div className={styles.name_input_container}>
                            <InputString placeholder="Введите название трека" {...name} isRequired={true} />
                        </div>
                        <div className={styles.artist_input_container}>
                            {!isNeedInput && (
                                <>
                                    <label htmlFor="dsad">Найти и выбрать исполнителя</label>
                                    <SearchInput value={artist.value} setValue={artist.setValue} />
                                    <Btn onClick={handleAddInput}>Не нашли исполнителя?</Btn>
                                </>
                            )}
                            {isNeedInput && (
                                <>
                                    <InputString value={artist.value} setValue={artist.setValue} placeholder='Добавить исполнителя' isRequired={true} />
                                    <Btn onClick={handleAddInput}>Назад</Btn>
                                </>
                            )}
                        </div>
                        <div className={styles.SelectInput_container}>
                            <label htmlFor="dsadsad">Выберите жанр трека</label>
                            <CheckInput
                                options={options}
                                setOptions={setOptions}
                                setValue={genre.setValue}
                            />
                        </div>
                        <div className={styles.textarea_container}>
                            <Textarea placeholder="Введите текст песни" value={text.value} setValue={text.setValue} onChangeNeed={true} isRequired={true} />
                        </div>
                        <div className={styles.btn__container}>
                            <button className={styles.btn} onClick={next}>Вперед</button>
                        </div>
                    </div>
                )}
                {activeStep === 2 && <TrackCoverUpload next={next} back={back} setPicture={setPicture} />}
                {activeStep === 3 && <TrackFileUpload next={next} back={back} audio={audio} setAudio={setAudio} />}
                {isNeedModal && <ModalContainer setState={setIsNeedModal} text={modalText} />}
            </StepWrapper>
        </MainLayout>
    );
});

Create.displayName = 'CreateTracks';
export default Create;

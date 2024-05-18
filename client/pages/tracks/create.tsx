'use client'

import MainLayout from "@/layouts/MainLayout"
import { memo, useState } from "react"
import styles from '@/styles/CreateTrack.module.css'
import { useRouter } from "next/router"
import { useInput } from "@/hooks/useInput"
import { StaticImageData } from "next/image"
import useActions from "@/hooks/useActions"
import { baseUrl } from "@/services/baseUrl"
import { useCreateTrackMutation } from "@/api/TrackService"
import StepWrapper from "@/components/Tracks/Create/StepWrapper/StepWrapper"
import Textarea from "@/UI/Textarea/Textarea"
import TrackCoverUpload from "@/components/Tracks/Create/TrackCoverUpload/TrackCoverUpload/TrackCoverUpload"
import InputString from "@/UI/InputString/InputString"
import TrackFileUpload from "@/components/Tracks/Create/TrackFileUpload/TrackFileUpload"

const Create = memo(() => {

    const [activeStep, setActiveStep] = useState<number>(1)
    const [picture, setPicture] = useState<File | null | StaticImageData>(null)
    const [audio, setAudio] = useState<File | null>(null)
    const [isInputEmpty, setIsInputEmpty] = useState<boolean>(false)

    const {setUploadPicture} = useActions()

    const name = useInput('')
    const artist = useInput('')
    const text = useInput('')

    const [createTrackMutation] = useCreateTrackMutation()

    const router = useRouter()

    let file: File | null = null;

    const toFile = async () => {
        try {
            const response = await fetch(baseUrl + 'image/iscover.jpg');
            const blob = await response.blob();
            file = new File([blob], 'cover.jpg', {type: blob.type, lastModified: Date.now()});
        } catch (error) {
            console.error(error);
        }
    }

    const handleCreate = async (formData: any) => {

        if (name && artist && audio) {

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
                console.log(response)
                setUploadPicture('')
            } catch (error) {
                console.error('Error creating track:', error);
            }
        } else {
            console.error('Missing required data');
        }
    }

    const next = async () => {
        if(activeStep < 3) {
            if (name.value.trim() !== '' && artist.value.trim() !== '') {
                setActiveStep(prev => prev + 1);
            } else {
                setIsInputEmpty(true)
            }
        } else{
            const formData = new FormData();
            await handleCreate(formData)
        }
    }

    const back = () => {
        if(activeStep > 1) {
            setActiveStep(prev => prev - 1)
        }
    }

    return(
        <MainLayout title_text="Добавление трека">
            <StepWrapper setActiveStep={setActiveStep} activeStep={activeStep} nameInput={name.value} artistInput={artist.value}>

                {activeStep === 1 && (
                    <div className={styles.container}>

                        <div className={styles.name_input_container}>
                            {isInputEmpty 
                            ? <div>пошел на хуй</div>
                            : ''
                            }
                            <InputString placeholder="Введите название трека" {...name} isRequired={true}/>
                        </div>
                        <div className={styles.artist_input_container}>
                            {isInputEmpty 
                            ? <div>пошел на хуй</div>
                            : ''
                            }
                            <InputString placeholder="Введите исполнителя трека" {...artist} isRequired={true}/>
                        </div>
                        <div className={styles.textarea_container}>
                            <Textarea
                                placeholder="Введите текст песни"
                                value={text.value}
                                setValue={text.setValue}
                                onChangeNeed={true}
                                isRequired={true}
                            />
                        </div>
                        <div className={styles.btn__container}>
                            <button className={styles.btn} onClick={next}>Вперед</button>
                        </div>
                    </div>
                )}
                {activeStep === 2 && (
                    <TrackCoverUpload next={next} back={back} setPicture={setPicture}/>
                )}
                {activeStep === 3 && (
                    <TrackFileUpload next={next} back={back} audio={audio} setAudio={setAudio}/>
                )}


            </StepWrapper>
        
        </MainLayout>
    )
})

Create.displayName = 'CreateTracks';
export default Create
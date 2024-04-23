'use client'

import Input from "@/components/Input"
import StepWrapper from "@/components/StepWrapper"
import MainLayout from "@/layouts/MainLayout"
import { useState } from "react"
import styles from '@/styles/Create.module.css'
import Textarea from "@/components/Textarea"
import ImageUpload from "@/components/ImageUpload"
import AudioUpload from "@/components/AudioUpload"
import { useRouter } from "next/router"
import { useCreateTrackMutation } from "@/services/TrackService"
import { useInput } from "@/hooks/useInput"
import cover from '@/assets/iscover.jpg'
import { StaticImageData } from "next/image"
import useActions from "@/hooks/useActions"

const Create = () => {

    const [activeStep, setActiveStep] = useState(1)
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
            const response = await fetch('http://localhost:5000/image/iscover.jpg');
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
                router.push('/tracks');
                setUploadPicture('')
            } catch (error) {
                console.error('Error creating track:', error);
            }
        } else {
            console.error('Missing required data');
        }
    }

    const next = () => {
        if(activeStep < 3) {
            if (name.value.trim() !== '' && artist.value.trim() !== '') {
                setActiveStep(prev => prev + 1);
            } else {
                setIsInputEmpty(true)
            }
        } else{
            const formData = new FormData();
            handleCreate(formData)
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

                        <div>
                            {isInputEmpty 
                            ? <div>пошел на хуй</div>
                            : ''
                            }
                            <Input placeholder="Введите название трека" {...name} isRequired={true}/>
                        </div>
                        <div>
                            {isInputEmpty 
                            ? <div>пошел на хуй</div>
                            : ''
                            }
                            <Input placeholder="Введите исполнителя трека" {...artist} isRequired={true}/>
                        </div>
                        <div className={styles.textarea_container}>
                            <Textarea placeholder="Введите текст песни" {...text}/>
                        </div>
                        <div className={styles.btn__container}>
                            <button className={styles.btn} onClick={next}>Вперед</button>
                        </div>
                    </div>
                )}
                {activeStep === 2 && (
                    <ImageUpload next={next} back={back} setPicture={setPicture}/>
                )}
                {activeStep === 3 && (
                    <AudioUpload next={next} back={back} audio={audio} setAudio={setAudio}/>
                )}


            </StepWrapper>
        
        </MainLayout>
    )
}

export default Create
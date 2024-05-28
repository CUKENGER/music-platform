'use client'

import MainLayout from "@/layouts/MainLayout";
import { memo, useState } from "react";
import StepWrapper from "@/components/Tracks/Create/StepWrapper/StepWrapper";
import TrackFileUpload from "@/components/Tracks/Create/TrackFileUpload/TrackFileUpload";
import ModalContainer from "@/UI/ModalContainer/ModalContainer";
import TrackCoverUpload from "@/components/Tracks/Create/TrackCoverUpload/TrackCoverUpload/TrackCoverUpload";
import { genres } from "@/services/genres";
import { useCreateTrack } from "@/api/Track/createTrack";
import FirstStep from "@/components/Tracks/Create/FirstStep/FirstStep";

const Create = memo(() => {
    const [activeStep, setActiveStep] = useState<number>(1);
    
    const [options, setOptions] = useState<string[]>(genres);

    const {handleCreate,
        showModal,
        name,
        artist,
        genre,
        text,
        setPicture,
        audio,
        setAudio,
        modal,
        checkFirstValues,
        hideModal
    } = useCreateTrack()

    const next = async () => {
        if (activeStep < 3) {
            if (checkFirstValues) {
                setActiveStep(prev => prev + 1);
            } else {
                showModal("Заполните все необходимые поля")
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
                    <FirstStep 
                        name={name}
                        artist={artist}
                        options={options}
                        setOptions={setOptions}
                        text={text}
                        genre={genre}
                        next={next}
                    />
                )}
                {activeStep === 2 && (
                    <TrackCoverUpload 
                        next={next}
                        back={back} 
                        setPicture={setPicture} 
                    />
                )
                }
                {activeStep === 3 && (
                    <TrackFileUpload 
                        next={next} 
                        back={back} 
                        audio={audio} 
                        setAudio={setAudio} 
                    />
                    )}
                {modal.isOpen && (
                    <ModalContainer 
                        hideModal={hideModal}
                        text={modal.message} 
                        onClick={modal.onClick}
                    />
                )}
                
            </StepWrapper>
        </MainLayout>
    );
});

Create.displayName = 'CreateTracks';
export default Create;

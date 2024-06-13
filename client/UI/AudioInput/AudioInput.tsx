import { ChangeEvent, FC } from 'react'
import styles from './AudioInput.module.css'

interface AudioInputProps{
    placeholder: string;
    setAudio: (audio: File) => void;
    audioName?: string | null
}

const AudioInput:FC<AudioInputProps> = ({placeholder, setAudio, audioName}) => {

    const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAudio(e.target?.files[0])
        }
    }

    return (
        <div className={styles.container}>
            {audioName && (
                <div className={styles.audioName_container}>
                    <p>{audioName}</p>
                </div>
            )}
            <input 
                onChange={handleAudioChange}
                className={styles.input}
                id='fileAudio'
                type="file"
                accept='audio/*'
            />
            <label htmlFor="fileAudio" className={styles.label}>
                {placeholder}
            </label>

        </div>
    )
}

export default AudioInput
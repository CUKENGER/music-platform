import { ChangeEvent, FC } from 'react'
import styles from './AudioInput.module.css'

interface AudioInputProps{
    placeholder: string;
    setAudio: (audio: File) => void;
}

const AudioInput:FC<AudioInputProps> = ({placeholder, setAudio}) => {

    const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAudio(e.target?.files[0])
        }
    }

    return (
        <div className={styles.container}>
            <input 
                onChange={handleAudioChange}
                className={styles.input}
                id='file'
                type="file"
            />
            <label htmlFor="file" className={styles.label}>
                {placeholder}
            </label>
        </div>
    )
}

export default AudioInput
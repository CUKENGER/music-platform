import { ChangeEvent, FC, memo, useState } from 'react'
import styles from './ImageInput.module.css'
import { baseUrl } from '@/services/baseUrl';

interface FileInputProps{
    placeholder: string;
    setPicture: (picture: File) => void
    currentPicture?: string | null
}

const ImageInput:FC<FileInputProps> = memo(({placeholder, setPicture, currentPicture}) => {

    const [uploadPicture, setUploadPicture] = useState<string | null>(null)

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        
        const file = e.target.files?.[0];
        
        if (file) {
            setPicture(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadPicture(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className={styles.container}>
            <input 
                onChange={handleImageChange}
                className={styles.input}
                id='file'
                type="file"
                accept='image/*'
            />

            <label htmlFor="file" className={styles.label}>
                {placeholder}
                {currentPicture && !uploadPicture && (
                    <img 
                    className={styles.uploadPicture} 
                    src={currentPicture} 
                    alt="uploaded cover" 
                />
                )}
                {uploadPicture && (
                    <img 
                        className={styles.uploadPicture} 
                        src={uploadPicture} 
                        alt="uploaded cover" 
                    />
                )}
            </label>
        </div>
    )
})

export default ImageInput
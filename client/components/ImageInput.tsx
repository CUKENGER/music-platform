import useActions from '@/hooks/useActions';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import styles from '@/styles/ImageInput.module.css'
import { ChangeEvent, FC, useState} from 'react';

interface ImageInputProps {
    setPicture: (picture:File)=> void;
}

const ImageInput:FC<ImageInputProps> = ({setPicture}) => {

    const {uploadPicture} = useTypedSelector(state => state.uploadPictureReducer)

    const {setUploadPicture} = useActions()

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPicture(e.target?.files[0])
        }
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();

            reader.onload = (e) => {
                setUploadPicture(e.target?.result as string);
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className={styles.container}>  
            <input id='file' className={styles.input} type="file" onChange={handleImageChange} accept='image/*'  />
            <label htmlFor="file" className={styles.label}>Выберите файл</label>
            {uploadPicture &&
                <img className={styles.img} src={uploadPicture} alt="uploaded"/>
            }
                
        </div>
        
    )
}

export default ImageInput
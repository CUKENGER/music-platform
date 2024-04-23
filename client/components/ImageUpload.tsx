import styles from '@/styles/ImageUpload.module.css'
import ImageInput from './ImageInput'
import { FC, useState } from 'react'

interface ImageUploadProps {
    next: ()=> void;
    back: ()=> void;
    setPicture: (picture: File | null)=> void;
}

const ImageUpload:FC<ImageUploadProps> = ({next, back, setPicture}) => {

    return (
        <div className={styles.container}>
            <div className={styles.left_container}>
                <ImageInput setPicture={setPicture}/>
            </div>
            
            <div className={styles.right_container}>
                <p className={styles.text}>Загрузите обложку трека</p>
                <div className={styles.btns_container}>
                    <button onClick={back} className={styles.btn}>Назад</button>
                    <button onClick={next} className={styles.btn}>Далее</button>
                </div>
            </div>
        </div>
    )
}

export default ImageUpload
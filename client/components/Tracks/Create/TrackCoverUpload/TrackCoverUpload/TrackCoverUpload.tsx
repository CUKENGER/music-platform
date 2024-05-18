import styles from './TrackCoverUpload.module.css'
import { FC } from 'react'
import TrackCoverInput from '../TrackCoverInput/TrackCoverInput';
import Btn from "@/UI/Btn/Btn";

interface ImageUploadProps {
    next: ()=> void;
    back: ()=> void;
    setPicture: (picture: File | null)=> void;
}

const TrackCoverUpload:FC<ImageUploadProps> = ({next, back, setPicture}) => {

    return (
        <div className={styles.container}>
            <p className={styles.text}>Загрузите обложку трека</p>
            <div className={styles.left_container}>
                <TrackCoverInput setPicture={setPicture}/>
            </div>
            
            <div className={styles.right_container}>
                
                <div className={styles.btns_container}>
                    <Btn onClick={back}>Назад</Btn>
                    <Btn onClick={next}>Далее</Btn>
                </div>
            </div>
        </div>
    )
}

export default TrackCoverUpload
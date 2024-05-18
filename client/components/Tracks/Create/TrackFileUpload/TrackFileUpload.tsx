import { useTypedSelector } from '@/hooks/useTypedSelector';
import styles from './TrackFileUpload.module.css'
import { ChangeEvent, FC } from 'react'
import Btn from "@/UI/Btn/Btn";

interface AudioUploadProps {
    next: ()=> void;
    back: ()=> void;
    audio: File | null;
    setAudio: (audio: File | null)=> void;
}

const TrackFileUpload:FC<AudioUploadProps> = ({next, back, audio, setAudio}) => {

    const {uploadPicture} = useTypedSelector(state => state.uploadPictureReducer)

    const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAudio(file);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.left_container}>
                    <div className={styles.container}>  
                        {uploadPicture ? (
                            <img className={styles.img} src={uploadPicture} alt='cover'/>
                        ): (
                            <p>Обложка не загружена</p>
                        )}
                    </div>
            </div>
            
            <div className={styles.right_container}>
                {audio ? (
                ('')
                )
                : (<p className={styles.text}>Загрузите трек</p>)}
                <form action="/upload" method="post" encType="multipart/form-data">
                    <input
                        id='file'
                        className={styles.input}
                        type="file"
                        onChange={handleAudioChange}
                        accept='audio/*'
                    />
                    <label htmlFor="file" className={styles.label}>Выберите файл</label>
                </form>
                {audio && (
                    <>
                        <p>Аудиодорожка успешно загружена</p>
                        <p>{audio.name}</p>
                    </>
                )}
                <div className={styles.btns_container}>
                    <Btn onClick={back}>Назад</Btn>
                    <Btn onClick={next}>Далее</Btn>
                </div>
            </div>
        </div>
    )
}

export default TrackFileUpload
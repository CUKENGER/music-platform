import { useTypedSelector } from '@/hooks/useTypedSelector';
import styles from '@/styles/AudioUpload.module.css'
import { ChangeEvent, FC } from 'react'


interface AudioUploadProps {
    next: ()=> void;
    back: ()=> void;
    audio: File | null;
    setAudio: (audio: File)=> void;
}

const AudioUpload:FC<AudioUploadProps> = ({next, back, audio, setAudio}) => {

    const {uploadPicture} = useTypedSelector(state => state.uploadPictureReducer)

    const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAudio(e.target?.files[0])
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
                    <input id='file' className={styles.input} type="file" onChange={handleAudioChange} accept='audio/*'  />
                    <label htmlFor="file" className={styles.label}>Выберите файл</label>
                </form>
                {audio && (
                    <>  
                        <p>Аудиодорожка успешно загружена</p>
                        <p>{audio.name}</p>
                    </>
                )}
                <div className={styles.btns_container}>
                    <button onClick={back} className={styles.btn}>Назад</button>
                    <button onClick={next} className={styles.btn}>Далее</button>
                </div>
            </div>
        </div>
    )
}

export default AudioUpload
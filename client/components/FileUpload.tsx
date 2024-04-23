import styles from '@/styles/AudioUpload.module.css'
import { ChangeEvent, FC } from 'react'


interface AudioUploadProps {
    next: ()=> void;
    back: ()=> void;
    audio: string | null;
    setAudio: (e: any)=> void;
    picture: string | null;
}

const AudioUpload:FC<AudioUploadProps> = ({next, back, audio, setAudio, picture}) => {

    const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            console.log('adio in jopa', audio)
            setAudio(e.target?.files[0])
            let reader = new FileReader();

            reader.onload = (e) => {
                // console.log(e.target?.result)
                setAudio(e.target?.result as string);
                console.log('audio in AudioUpload',audio)
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.left_container}>
                    <div className={styles.container}>  
                        {picture ? (
                            <img className={styles.img} src={picture} alt='cover'/>
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
                {audio && (<p>Аудиодорожка успешно загружена</p>)}
                <div className={styles.btns_container}>
                    <button onClick={back} className={styles.btn}>Назад</button>
                    <button onClick={next} className={styles.btn}>Далее</button>
                </div>
            </div>
        </div>
    )
}

export default AudioUpload
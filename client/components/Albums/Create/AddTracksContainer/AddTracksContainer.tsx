import { ChangeEvent, FC } from 'react'
import styles from './AddTracksContainer.module.css'
import { TrackFile } from '@/store/reducers/addTrackSlice'
import Image from 'next/image'
import delete_icon from '@/assets/delete.svg'
import plusBtn from '@/assets/plusBtn.png'
import { ITrack } from '@/types/track'
import Textarea from '@/UI/Textarea/Textarea'


interface AddTracksContainerProps{
    tracks: ITrack[];
    setTracks: (tracks: ITrack[]) => void;
}

const AddTracksContainer:FC<AddTracksContainerProps> = ({tracks, setTracks}) => {

    const handleAddTrack = () => {
        setTracks([...tracks, {
            name: '', text: '', audio: null,
            artist: '',
            listens: 0,
            picture: null,
            comments: []
        }]);
    }

    const removeTrack = (index: number) => {
        const updatedTracks = [...tracks];
        updatedTracks.splice(index, 1);
        setTracks(updatedTracks);
    };

    const handleTrackNameChange = (index: number, newValue: string) => {
        const updatedTracks = [...tracks];
        updatedTracks[index].name = newValue;
        setTracks(updatedTracks);
    };

    const handleTrackTextChange = (index: number, newValue: string) => {
        const updatedTracks = [...tracks];
        updatedTracks[index].text = newValue;
        setTracks(updatedTracks);
    };

    const handleAddTrackFile = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        let files = e.target?.files
        let trackFile = files && files[0]
        if(trackFile) {
            const updatedTracks = [...tracks]
            updatedTracks[index].audio = trackFile
            setTracks(updatedTracks)
        }
    }

    return (
        <div className={styles.addTracks_container}>
            <p className={styles.addTracks_title}>Добавление треков</p>
            <div className={styles.addTracks_list}>
                {tracks.map((track, index) => (
                    <div key={index} className={styles.addTrack_item_container}>
                        <div className={styles.main_input_container}>
                            <label className={styles.label} htmlFor="inputName">Введите название песни</label>
                            <input
                                id='inputName'
                                // placeholder='Введите название песни'
                                className={styles.input_name}
                                type="text"
                                value={track.name} 
                                onChange={(e) => handleTrackNameChange(index, e.target.value)}
                                required={true}
                            />
                            <Textarea
                                placeholder='Введите текст песни'
                                value={track.text}
                                handleChange={(e: any) => handleTrackTextChange(index, e.target.value)}
                                isRequired={true}
                            />
                        </div>
                        <div className={styles.addTrack_right_container}>
                            {track.audio && typeof track.audio !== 'string' && (
                                <div className={styles.result_name_container}>
                                    <p>{track.audio.name}</p>
                                </div>
                            )}
                            <div className={styles.input_audio_container}>
                                <p>Загрузите аудиодорожку</p>
                                <input
                                    className={styles.input_audio}
                                    id={`audio_${index}`}
                                    type='file'
                                    accept='audio/*'
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleAddTrackFile(index, e)}
                                    required={true}
                                />
                                <label 
                                    className={styles.label_audio} 
                                    htmlFor={`audio_${index}`}
                                >
                                    Выберите файл
                                </label>
                            </div>
                            
                            <button 
                                className={styles.delete_btn}
                                onClick={() => removeTrack(index)}
                            >
                                <Image
                                    src={delete_icon}
                                    alt='delete icon'
                                />
                            </button>
                        </div>
                    </div>
                ))}
                <button 
                    className={styles.plus_btn}
                    onClick={handleAddTrack}
                >
                    <Image
                        className={styles.plus_icon}
                        src={plusBtn}
                        alt='plus btn icon'
                        quality={100}
                    />
                </button>


                </div>
            
        </div>
    )
}

export default AddTracksContainer
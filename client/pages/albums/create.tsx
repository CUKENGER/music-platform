import ImageInput from '@/UI/ImageInput/ImageInput'
import InputString from '@/UI/InputString/InputString'
import Textarea from '@/UI/Textarea/Textarea'
import { useInput } from '@/hooks/useInput'
import MainLayout from '@/layouts/MainLayout'
import styles from '@/styles/CreateAlbum.module.css'
import { ChangeEvent, useCallback, useState } from 'react'
import AddTracksContainer from '@/components/Albums/Create/AddTracksContainer/AddTracksContainer'
import { useCreateAlbumMutation } from '@/api/AlbumService'
import {ITrack } from '@/types/track'
import ModalContainer from '@/UI/ModalContainer/ModalContainer'
import { useRouter } from 'next/router'
import SearchInput from '@/UI/SearchInput/SearchInput'
import Btn from '@/UI/Btn/Btn'
import CheckInput from '@/UI/CheckInput/CheckInput'

const CreateAlbum = () => {
    const router = useRouter()
    const name = useInput('')
    const artist = useInput('')
    const genre = useInput('')
    const releaseDate = useInput('')
    const description = useInput('')
    const [isErrorModal, setIsErrorModal] = useState(false)
    const [isNeedInput, setIsNeedInput] = useState(false)
    const [options, setOptions] = useState<string[]>([
        "Pop", "Rock", "Indie", "Folk", "Country", "Punk", "Alternative", "Dance / Electronic", "Classic"
    ]);

    const [createAlbumMutation, {isError, isLoading}] = useCreateAlbumMutation()

    const [tracks, setTracks] = useState<ITrack[]>([{
        name: '', audio: '',
        artist: artist.value,
        listens: 0,
        picture: '',
        text: '',
        comments: []
    }]);

    const [cover, setCover] = useState<File | null>()

    const handleCreate = async () => {
        const formData = new FormData()
        if (name && artist && releaseDate && description && tracks && cover) {
            formData.append('name', name.value)
            formData.append('artist', artist.value)
            formData.append('genre', genre.value)
            formData.append('releaseDate', releaseDate.value)
            formData.append('description', description.value)
            formData.append('picture', cover)

            tracks.forEach((track, index) => {
                if (track.audio) {
                    formData.append('tracks', track.audio)
                    formData.append(`track_names`, track.name);
                    formData.append(`track_texts`, track.text);
                }
            })

            try {
                const response = await createAlbumMutation(formData)
                console.log('Response data:', response);
                console.log('Отправлено');
                // router.push('/albums')
            } catch (e) {
                console.error('Error creating album:', e);
            }
        } else{
            setIsErrorModal(true)
        }
    }


    const handleInputDateChange = useCallback((e:ChangeEvent<HTMLInputElement>)=> {
        releaseDate.setValue(e.target.value)
    }, [] )

    const handleAddInput = () => {
        setIsNeedInput(!isNeedInput)
    }

    return (
        <MainLayout title_text='Загрузка альбома'>
            <div className={styles.container}>
                <div className={styles.mainInfo_container}>
                    <div className={styles.inputs_container}>

                        <InputString
                            value={name.value}
                            setValue={name.setValue} 
                            placeholder='Введите название альбома'
                            isRequired={true}
                        />
                        {!isNeedInput && (
                            <>
                                <label htmlFor="dsad">Найти и выбрать исполнителя</label>
                                <SearchInput
                                    value={artist.value}
                                    setValue={artist.setValue}
                                />
                                <Btn onClick={handleAddInput}>Не нашли исполнителя?</Btn>
                            </>
                        )}
                        
                        {isNeedInput && (
                            <>
                                <InputString
                                    value={artist.value}
                                    setValue={artist.setValue} 
                                    placeholder='Добавить исполнителя'
                                    isRequired={true}
                                />
                                <Btn onClick={handleAddInput}>Назад</Btn>
                            </>
                        )}
                        <label id='label_input_date' htmlFor="input_date">Введите дату выхода</label>
                        <input
                            value={releaseDate.value}
                            onChange={handleInputDateChange}
                            className={styles.input_date}
                            id='input_date'
                            type='date'
                            required={true}
                        />
                        <div className={styles.SelectInput_container}>
                            <label htmlFor="dsadsad">Выберите жанр альбома</label>
                            <CheckInput 
                                options={options}
                                setOptions={setOptions}
                                setValue={genre.setValue}
                            />
                        </div>
                        <Textarea
                            value={description.value}
                            setValue={description.setValue}
                            placeholder='Введите описание к альбому'
                            isRequired={true}
                            onChangeNeed={true}
                        />
                    </div>
                    <div className={styles.inputPhoto_container}>
                        <div>
                            <p>Загрузите обложку альбома</p>
                        </div>
                        <div className={styles.ImageInput_container}>
                            <ImageInput
                                setPicture={setCover} 
                                placeholder='Выберите файл'
                            />
                        </div>
                    </div>
                </div>
                <AddTracksContainer
                    tracks={tracks}
                    setTracks={setTracks}
                />
                <button className={styles.nextBtn} onClick={handleCreate}>
                    {isLoading &&(<span className={styles.loader}></span>)}
                    Отправить
                </button>
                {isErrorModal && (
                    <ModalContainer text='Заполните все данные, пожалуйста' setState={setIsErrorModal}/>
                )}
                
            </div>
        </MainLayout>
    )
}

export default CreateAlbum


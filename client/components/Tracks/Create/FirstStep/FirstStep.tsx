import { FC, memo, useState } from "react";
import styles from './FirstStep.module.css'
import InputString from "@/UI/InputString/InputString";
import SearchInput from "@/UI/SearchInput/SearchInput";
import Btn from "@/UI/Btn/Btn";
import CheckInput from "@/UI/CheckInput/CheckInput";
import Textarea from "@/UI/Textarea/Textarea";

interface FirstStepProps {
    name: {setValue: (e:string) => void; value: string};
    artist: {setValue: (e:string) => void; value: string};
    text: {setValue: (e:string) => void; value: string};
    genre: {setValue: (e:string) => void; value: string};
    options: string[];
    setOptions:(options: string[]) => void;
    next: () => void
}

const FirstStep:FC<FirstStepProps> = memo(({name, artist, text, options, setOptions, genre, next}) => {
    const [isNeedInput, setIsNeedInput] = useState(false);

    const handleAddInput = () => {
        setIsNeedInput(!isNeedInput);
    };

    return (
        <div className={styles.container}>
                        <div className={styles.name_input_container}>
                            <InputString 
                                placeholder="Введите название трека" 
                                value={name.value} 
                                isRequired={true} 
                                setValue={name.setValue}
                            />
                        </div>
                        <div className={styles.artist_input_container}>
                            {!isNeedInput && (
                                <>
                                    <label htmlFor="dsad">Найти и выбрать исполнителя</label>
                                    <SearchInput value={artist.value} setValue={artist.setValue} />
                                    <Btn onClick={handleAddInput}>
                                        Не нашли исполнителя?
                                    </Btn>
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
                        </div>
                        <div className={styles.SelectInput_container}>
                            <label htmlFor="dsadsad">Выберите жанр трека</label>
                            <CheckInput
                                value={genre.value}
                                options={options}
                                setOptions={setOptions}
                                setValue={genre.setValue}
                            />
                        </div>
                        <div className={styles.textarea_container}>
                            <Textarea 
                                placeholder="Введите текст песни" 
                                value={text.value} 
                                setValue={text.setValue} 
                                onChangeNeed={true} 
                                isRequired={true} 
                            />
                        </div>
                        <div className={styles.btn__container}>
                            <button className={styles.btn} onClick={next}>
                                Вперед
                            </button>
                        </div>
                    </div>
    )
})

export default FirstStep
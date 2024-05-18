import { useTypedSelector } from "@/hooks/useTypedSelector";
import { memo, useState } from "react";
import DropDownArrow from '@/assets/DropDownArrowActive.svg'
import DropDownArrowActive from '@/assets/DropDownArrow.svg'
import styles from './SelectInput.module.css'
import Image from 'next/image'


const genres = [
    {name: 'Pop'},
    {name: 'Rock'},
    {name: 'Alternative'},
    {name: 'Punk'},
    {name: 'Indie'},
    {name: 'Folk'},
    {name: 'Rap'},
    {name: 'Dance / Electronic'},
    {name: 'Bard'},
    {name: 'Classic'},
    {name: 'Blues'},
    {name: 'Country'},
]

const SelectInput = memo(() => {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedGenre, setSelectedGenre] = useState('Выберите жанр')

    const {isNavbarOpen} = useTypedSelector(state => state.dropdownReducer)

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleSort = (genre: string) => {
        setSelectedGenre(genre)
    }

    return (
        <div 
            onClick={toggleMenu}
            className={isOpen ? styles.container_active : styles.container}
        >
            {!isNavbarOpen && (
                <>
                    <button
                        className={isOpen ? styles.btn_active : styles.btn}
                    >
                        <p className={styles.btn_text}>{selectedGenre}</p>
                        <Image
                            className={styles.btn_arrow}
                            src={isOpen ? DropDownArrow : DropDownArrowActive}
                            alt="dropdown arrow"
                        />
                    </button>
                    <ul className={isOpen ? styles.list_open : styles.list}>

                        {genres.map((genre) => (
                            <li
                                key={genre.name}
                                className={styles.list_item}
                                onClick={() => handleSort(genre.name)}
                            >
                                {genre.name}
                            </li>
                        ))}
                        
                    </ul>
                </>
            )}

        </div>
    )
})

export default SelectInput
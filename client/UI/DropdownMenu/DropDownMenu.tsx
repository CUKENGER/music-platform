import styles from './DropDownMenu.module.css'
import { memo, useState } from 'react';
import DropDownArrow from '@/assets/DropDownArrowActive.svg'
import DropDownArrowActive from '@/assets/DropDownArrow.svg'
import Image from 'next/image'
import useActions from '@/hooks/useActions';
import { useTypedSelector } from '@/hooks/useTypedSelector';

const DropDownMenu = memo(() => {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const {setSelectedSort} = useActions()

    const {selectedSort, isNavbarOpen} = useTypedSelector(state => state.dropdownReducer)

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleSort = (sortType:string) => {
        setSelectedSort(sortType)
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
                        <p className={styles.btn_text}>{selectedSort}</p>
                        <Image
                            className={styles.btn_arrow}
                            src={isOpen ? DropDownArrow : DropDownArrowActive}
                            alt="dropdown arrow"
                        />
                    </button>
                    <ul className={isOpen ? styles.list_open : styles.list}>
                        <li
                            className={styles.list_item}
                            onClick={() => handleSort('Все')}
                        >
                            Все
                        </li>
                        <li
                            className={styles.list_item}
                            onClick={() => handleSort('Популярные')}
                        >
                            Популярные
                        </li>
                        <li
                            className={styles.list_item}
                            onClick={() => handleSort('По алфавиту')}
                        >
                            По алфавиту
                        </li>
                    </ul>
                </>
            )}

        </div>
    )
})

export default DropDownMenu
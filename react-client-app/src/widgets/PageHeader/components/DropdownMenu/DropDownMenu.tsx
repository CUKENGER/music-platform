import DropDownArrowActive from '@/assets/DropDownArrow.svg';
import DropDownArrow from '@/assets/DropDownArrowActive.svg';
import useActions from '@/shared/hooks/useActions';
import { memo, useState } from 'react';
import styles from './DropDownMenu.module.scss';
import { useTypedSelector } from '@/shared/hooks/useTypedSelector';

const DropDownMenu = memo(() => {

	const [isOpen, setIsOpen] = useState<boolean>(false)
	const {selectedSort} = useTypedSelector(state => state.dropdownReducer)
	const {setSelectedSort} = useActions()

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const handleSort = (sortType: string) => {
		setSelectedSort(sortType)
	}

	return (
		<div
			onClick={toggleMenu}
			className={isOpen ? styles.container_active : styles.container}
		>
			<>
				<button
					className={isOpen ? styles.btn_active : styles.btn}
				>
					<p className={styles.btn_text}>{selectedSort}</p>
					<img
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


		</div>
	)
})

export default DropDownMenu
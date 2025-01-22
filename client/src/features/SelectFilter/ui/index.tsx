import { useState, useEffect, useRef } from 'react';
import styles from './SelectFilter.module.scss';
import DropDownArrow from './assets/DropDownArrow.svg';
import DropDownArrowActive from './assets/DropDownArrowActive.svg';
import classNames from 'classnames';
import { useSelectFilterStore } from '@/shared/model';

interface SelectFilterProps {
  options: string[];
  className?: string;
}

export const SelectFilter = ({ options, className }: SelectFilterProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { selectedSort, setSelectedSort } = useSelectFilterStore();
  const ref = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSort = (sortType: string) => {
    setSelectedSort(sortType);
    // setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      onClick={toggleMenu}
      className={classNames(className, isOpen && styles.container_active, styles.container)}
    >
      <>
        <button className={isOpen ? styles.btn_active : styles.btn}>
          <p className={styles.btn_text}>{selectedSort}</p>
          <img
            className={styles.btn_arrow}
            src={isOpen ? DropDownArrowActive : DropDownArrow}
            alt="dropdown arrow"
          />
        </button>
        {isOpen && (
          <ul className={styles.list_open}>
            {options.map((option) => (
              <li key={option} className={styles.list_item} onClick={() => handleSort(option)}>
                {option}
              </li>
            ))}
          </ul>
        )}
      </>
    </div>
  );
};

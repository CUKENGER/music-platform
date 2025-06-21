import { useState, useEffect, useRef } from 'react';
import styles from './SelectFilter.module.scss';
import classNames from 'classnames';
import { useSelectFilterStore } from '@/shared/model';
import { CSSTransition } from 'react-transition-group';
import { DropdownArrowIcon } from './DropdownArrowIcon';

interface SelectFilterProps {
  options: string[];
  className?: string;
}

export const SelectFilter = ({ options, className }: SelectFilterProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { selectedSort, setSelectedSort } = useSelectFilterStore();
  const ref = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLUListElement>(null); // Для CSSTransition

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSort = (sortType: string) => {
    setSelectedSort(sortType);
    setIsOpen(false);
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
      <button className={isOpen ? styles.btn_active : styles.btn}>
        <p className={styles.btn_text}>{selectedSort}</p>
        <DropdownArrowIcon
          className={classNames(styles.btn_arrow, isOpen && styles.btn_arrow_active)}
        />
      </button>
      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames={{
          enter: styles.list_enter,
          enterActive: styles.list_enter_active,
          exit: styles.list_exit,
          exitActive: styles.list_exit_active,
        }}
        unmountOnExit
        nodeRef={nodeRef}
      >
        <ul
          ref={nodeRef}
          className={styles.list_open}
        >
          {options.map((option) => (
            <li
              key={option}
              className={styles.list_item}
              onClick={() => handleSort(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      </CSSTransition>
    </div>
  );
};

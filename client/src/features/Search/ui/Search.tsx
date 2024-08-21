import { FC } from 'react';
import styles from './Search.module.scss'

interface SearchProps{
  placeholder: string
}

export const Search:FC<SearchProps> = ({placeholder}) => {
  return (
    <input 
      name="main_input" 
      className={styles.input} 
      type="text" 
      placeholder={placeholder}
    /> 
  );
}


import styles from './Search.module.scss';

interface SearchProps {
  placeholder: string;
}

export const Search = ({ placeholder }: SearchProps) => {
  return <input name="main_input" className={styles.input} type="search" placeholder={placeholder} />;
};

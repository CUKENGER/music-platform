import styles from './InputCheckbox.module.scss';

interface InputCheckboxProps {
  placeholder: string;
  onChange?: () => void;
}

export const InputCheckbox = ({ placeholder, onChange }: InputCheckboxProps) => {
  return (
    <label className={styles.label}>
      <input type="checkbox" onChange={onChange} />
      <span className={styles.checkmark}></span>
      {placeholder}
    </label>
  );
};

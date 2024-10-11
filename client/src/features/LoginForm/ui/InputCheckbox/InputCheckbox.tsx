import {  FC } from 'react'
import styles from './InputCheckbox.module.scss'

interface InputCheckboxProps {
  placeholder: string;
  onChange?: () => void
}

export const InputCheckbox: FC<InputCheckboxProps> = ({placeholder, onChange}) => {

  return (
    <label className={styles.label}>
      <input type="checkbox" onChange={onChange}/>
      <span className={styles.checkmark}></span>
      {placeholder}
    </label>
  )
}
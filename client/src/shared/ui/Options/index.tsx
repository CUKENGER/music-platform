import { memo, useState } from 'react';
import styles from './Options.module.scss';

interface OptionsProps {
  options: string[];
  currentOption?: string;
  setOption: (option: string) => void;
  label?: string;
}

export const Options = memo(({ options, currentOption, setOption, label }: OptionsProps) => {
  const [fields, setFields] = useState(options);
  const [selectedOption, setSelectedOption] = useState<string | null>(currentOption ?? null);
  const [isExiting, setIsExiting] = useState(false);

  const handleOptionClick = (option: string) => {
    if (selectedOption === option) {
      setIsExiting(true);
      setTimeout(() => {
        setFields(options);
        setSelectedOption(null);
        setIsExiting(false);
      }, 300);
    } else {
      if (selectedOption) {
        setFields((prevOptions) => [...prevOptions, selectedOption]);
      }
      setSelectedOption(option);
      setFields((prevOptions) => prevOptions.filter((item) => item !== option));
    }
    setOption(option);
  };

  return (
    <div className={styles.checkInput}>
      {label && <p className={styles.label}>{label}</p>}
      <div className={styles.selectedOptions}>
        {selectedOption && (
          <div
            key={selectedOption}
            onClick={() => handleOptionClick(selectedOption)}
            className={`${styles.selectedOption} ${isExiting ? styles.exiting : ''}`}
          >
            <span className={styles.option_text}>{selectedOption}</span>
          </div>
        )}
      </div>
      <ul className={styles.options}>
        {fields.map((option, i) => (
          <li
            key={option + i}
            className={`${styles.option} ${selectedOption === option ? styles.selected : ''}`}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
});

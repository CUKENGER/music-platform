import { memo, useState } from 'react';
import styles from './Options.module.scss';

interface OptionsProps {
  options: string[];
  currentOption?: string;
}

export const Options = memo(({ options, currentOption }: OptionsProps) => {
  const [fields, setFields] = useState(options);
  const [selectedOption, setSelectedOption] = useState<string | null>(currentOption ?? null);

  const handleOptionClick = (option: string) => {
    if (selectedOption === option) {
      setFields((prevOptions) => prevOptions.filter((item) => item !== option));
      setSelectedOption(null);
    } else {
      if (selectedOption) {
        setFields((prevOptions) => [...prevOptions, selectedOption]);
      }
      setSelectedOption(option);
      setFields((prevOptions) => prevOptions.filter((item) => item !== option));
    }
  };

  return (
    <div className={styles.checkInput}>
      <div className={styles.selectedOptions}>
        {selectedOption && (
          <div
            key={selectedOption}
            onClick={() => handleOptionClick(selectedOption)}
            className={styles.selectedOption}
          >
            <span className={styles.option_text}>{selectedOption}</span>
          </div>
        )}
      </div>
      <ul className={styles.options}>
        {fields.map((option, i) => (
          <li key={option + i} className={styles.option} onClick={() => handleOptionClick(option)}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
});

import { FC, memo, useEffect, useState } from "react";
import styles from './CheckInput.module.css';

interface CheckInputProps {
    setValue: (e: string) => void;
    options: string[]
    setOptions: (e: any) => void;
    value: string;
    currentOption?: string
}

const CheckInput: FC<CheckInputProps> = memo(({ setValue, options, setOptions, value, currentOption}) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    useEffect(() => {
        if(selectedOption !== value) {
            setSelectedOption(value)
        }
    }, [value])

    useEffect(() => {
        if (currentOption) {
            setSelectedOption(currentOption)
        }
    }, [currentOption])

    const handleOptionClick = (option: string) => {
        if (selectedOption === option) {
            setOptions([...options, option]);
            setSelectedOption(null);
        } else {
            if (selectedOption) {
                setOptions((prevOptions: any) => [...prevOptions, selectedOption]);
                setValue(selectedOption)
            }
            setOptions((prevOptions: any[]) => prevOptions.filter((item) => item !== option));
            setSelectedOption(option);
        }
    };

    useEffect(() => {
        if(selectedOption) {
            setValue(selectedOption || '');
        }
    }, [selectedOption, setValue]);

    return (
        <div className={styles.checkInput}>
            <div className={styles.selectedOptions}>
                {selectedOption && (
                    <div
                        key={selectedOption}
                        onClick={() => handleOptionClick(selectedOption)}
                        className={styles.selectedOption}
                    >
                        <span>{selectedOption}</span>
                    </div>
                )}
            </div>
            <ul className={styles.options}>
                {options.map((option) => (
                    <li
                        key={option}
                        className={styles.option}
                        onClick={() => handleOptionClick(option)}
                    >
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    );
});

export default CheckInput;

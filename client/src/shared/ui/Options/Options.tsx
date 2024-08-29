import { FC, memo, useEffect, useState } from "react";
import styles from './Options.module.scss';

interface CheckInputProps {
    setValue: (value: string) => void;
    options: string[];
    setOptions: (options: string[] | ((prevOptions: string[]) => string[])) => void;
    value: string;
    currentOption?: string;
}

export const Options: FC<CheckInputProps> = memo(({ setValue, options, setOptions, value, currentOption }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    useEffect(() => {
        if (value !== selectedOption) {
            setSelectedOption(value);
        }
    }, [value]);

    useEffect(() => {
        if (currentOption) {
            setSelectedOption(currentOption);
        }
    }, [currentOption]);

    const handleOptionClick = (option: string) => {
        if (selectedOption === option) {
            setOptions((prevOptions) => prevOptions.filter((item) => item !== option));
            setSelectedOption(null);
        } else {
            if (selectedOption) {
                setOptions((prevOptions) => [...prevOptions, selectedOption]);
            }
            setSelectedOption(option);
            setOptions((prevOptions) => prevOptions.filter((item) => item !== option));
        }
    };

    useEffect(() => {
        if (selectedOption) {
            setValue(selectedOption);
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

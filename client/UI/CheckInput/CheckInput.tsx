import { FC, memo, useEffect, useState } from "react";
import styles from './CheckInput.module.css';

interface CheckInputProps {
    setValue: (e: string) => void;
    options: string[]
    setOptions: (e: any) => void
}

const CheckInput: FC<CheckInputProps> = memo(({ setValue, options, setOptions}) => {
    // const [options, setOptions] = useState<string[]>([
    //     "Pop", "Rock", "Indie", "Folk", "Country", "Punk", "Alternative", "Dance / Electronic", "Classic"
    // ]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleOptionClick = (option: string) => {
        if (selectedOption === option) {
            setOptions([...options, option]);
            setSelectedOption(null);
        } else {
            if (selectedOption) {
                setOptions((prevOptions: any) => [...prevOptions, selectedOption]);
            }
            setOptions((prevOptions: any[]) => prevOptions.filter((item) => item !== option));
            setSelectedOption(option);
        }
    };

    useEffect(() => {
        setValue(selectedOption || '');
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

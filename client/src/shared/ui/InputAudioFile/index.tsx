import { InputHTMLAttributes, useId, ChangeEvent, useState } from 'react';
import { Btn } from '../Btn';
import cl from './index.module.scss';

interface InputAudioFileProps extends InputHTMLAttributes<HTMLInputElement> {
  fileName?: string;
  setFile: (file: File | null) => void;
}

export const InputAudioFile = ({ fileName, setFile, ...defaultProps }: InputAudioFileProps) => {
  const [inputFileName, setInputFileName] = useState(fileName);
  const id = useId();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith('audio/')) {
        setFile(null);
        alert('Пожалуйста, выберите аудиофайл.');
        return;
      }

      console.log('file', file);
      setInputFileName(file.name);
      setFile(file);
    } else {
      setFile(null);
    }
    // if (defaultProps.onChange) {
    //   defaultProps.onChange(e);
    // }
  };

  const handleReset = () => {
    setFile(null);
  };

  console.log(`inputFileName`, inputFileName);

  return (
    <div className={cl.container}>
      <input
        onChange={handleFileChange}
        id={`inputAudio-${id}`}
        className={cl.input}
        type="file"
        accept={'audio/*'}
        {...defaultProps}
      />
      <label className={`${cl.label}`} htmlFor={`inputAudio-${id}`}>
        {fileName || inputFileName || defaultProps.placeholder || 'Выберите аудиофайл'}
      </label>
      {fileName && <Btn onClick={handleReset}>Сбросить</Btn>}
    </div>
  );
};

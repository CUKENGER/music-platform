import { InputHTMLAttributes, useId, useState, ChangeEvent } from 'react';
import { Btn } from '../Btn';
import cl from './index.module.scss';

interface InputImageFileProps extends InputHTMLAttributes<HTMLInputElement> {
  currentPicture?: string;
  setFile: (file: File | null) => void;
}

export const InputImageFile = ({
  currentPicture,
  setFile,
  ...defaultProps
}: InputImageFileProps) => {
  const id = useId();
  const [uploadPicture, setUploadPicture] = useState<string>('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        setFile(null);
        setUploadPicture('');
        alert('Пожалуйста, выберите файл изображения.');
        return;
      }

      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadPicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFile(null);
      setUploadPicture('');
    }
  };

  const handleReset = () => {
    setFile(null);
    setUploadPicture('');
  };

  return (
    <div className={cl.container}>
      <input
        onChange={handleImageChange}
        id={`inputImage-${id}`}
        className={cl.input}
        type="file"
        accept={'image/*'}
        {...defaultProps}
      />
      <label className={`${cl.label}`} htmlFor={`inputImage-${id}`}>
        {currentPicture && !uploadPicture && (
          <img className={cl.uploadPicture} src={currentPicture} alt="current cover" />
        )}
        {uploadPicture && (
          <img className={cl.uploadPicture} src={uploadPicture} alt="uploaded cover" />
        )}
        {!currentPicture && !uploadPicture && <span>Выберите изображение</span>}
      </label>
      {(currentPicture || uploadPicture) && <Btn onClick={handleReset} className={cl.reset_btn}>Сбросить</Btn>}
    </div>
  );
};

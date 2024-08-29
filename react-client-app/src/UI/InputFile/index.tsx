import { ChangeEvent, FC, memo, useState } from "react";
import styles from './InputFile.module.scss'

interface InputAudioProps{
  placeholder: string;
  fileName?:string
  setFile: (file: File) => void
  isAudio: boolean;
  currentPicture?: string
}

const InputFile:FC<InputAudioProps> = ({placeholder, fileName, setFile, isAudio=true, currentPicture}) => {

  const [uploadPicture, setUploadPicture] = useState<string>('')

  const onChange = (e:ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if(files) {
      setFile(files[0])
    }
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
        setFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setUploadPicture(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    }
  }

  return (
    <div className={styles.container}>
      <input 
        onChange={isAudio ? onChange : handleImageChange}
        id={isAudio ? 'inputAudio' : 'inputImage'}
        className={styles.input}
        type="file"
        accept={isAudio ? 'audio/*' : 'image/*'}
      />
      <label 
        className={`${styles.label} ${fileName ? '' : styles.invalid}`}
        htmlFor={isAudio ? 'inputAudio' : 'inputImage'}
      >
        {isAudio && fileName 
          ? fileName 
          : placeholder
        }
        {currentPicture && !uploadPicture && (
          <img 
            className={styles.uploadPicture}
            src={currentPicture} 
            alt="uploaded cover"
          />
        )}
        {uploadPicture && (
          <img 
            className={styles.uploadPicture} 
            src={uploadPicture} 
            alt="uploaded cover" 
          />
        )}
      </label>
    </div>
  );
};

export default memo(InputFile);
import { InputHTMLAttributes, useId } from 'react';
import styles from './MultipleInputAudio.module.scss';
import { Tooltip as ReactTooltip } from 'react-tooltip';

interface MultipleInputAudioProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MultipleInputAudio = ({ onChange, ...props }: MultipleInputAudioProps) => {
  const id = useId();

  return (
    <div className={styles.inputAudio_container}>
      <input
        className={styles.InputAudio}
        id={`album-audio-${id}`}
        type="file"
        accept="audio/*"
        onChange={onChange}
        multiple
        {...props}
      />
      <label
        className={styles.LabelAudio}
        htmlFor={`album-audio-${id}`}
        data-tooltip-id="downloadMultipleButton"
      >
        Загрузите аудиодорожки
      </label>
      <ReactTooltip
        id="downloadMultipleButton"
        place="top"
        content="Загрузить несколько файлов"
        delayShow={3000}
      />
    </div>
  );
};

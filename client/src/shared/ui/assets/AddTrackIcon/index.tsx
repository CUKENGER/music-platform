import { Tooltip as ReactTooltip } from 'react-tooltip';
import styles from './AddTrackIcon.module.scss';
import { PlusBtnIcon } from './PlusBtnIcon';

interface AddTrackIconProps {
  onClick: (e: React.MouseEvent) => void;
}

export const AddTrackIcon = ({ onClick }: AddTrackIconProps) => {
  return (
    <div
      className={styles.plusBtn}
      onClick={onClick}
      data-tooltip-id="addTrackFormButton"
    >
      <PlusBtnIcon className={styles.plusBtn_icon} />
      <ReactTooltip
        id="addTrackFormButton"
        place="top"
        content="Добавить трек"
        delayShow={3000}
      />
    </div>
  );
};

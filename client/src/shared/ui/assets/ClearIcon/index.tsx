import styles from "./ClearIcon.module.scss"
import crossBg from './crossBg.svg'
import cn from 'classnames'

interface ClearIconProps {
  handleClear: () => void;
  className?: string
}

export const ClearIcon = ({ handleClear, className }: ClearIconProps) => {
  return (
    <div onClick={handleClear} className={cn(className, styles.ClearIcon)}>
      <img src={crossBg} alt="clear icon" />
    </div>
  );
};

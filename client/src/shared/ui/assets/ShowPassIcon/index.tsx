import eye from './eye.svg';
import eye_off from './eye_off.svg';
import cn from 'classnames';
import cl from './index.module.scss';

interface ShowPassIconProps {
  isShow: boolean;
  className?: string;
}

export const ShowPassIcon = ({ isShow, className }: ShowPassIconProps) => {
  return (
    <div className={cn(className, cl.container)}>
      <img src={isShow ? eye : eye_off} className={cl.icon} alt="show password" />
    </div>
  );
};

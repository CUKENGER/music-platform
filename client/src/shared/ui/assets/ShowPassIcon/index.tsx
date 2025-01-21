import eye from './eye.svg'
import eye_off from './eye_off.svg'

interface ShowPassIconProps {
  isShow: boolean
}

export const ShowPassIcon = ({ isShow }: ShowPassIconProps) => {
  return (
    <div>
      <img src={isShow ? eye : eye_off} alt="show password" />
    </div>
  );
};

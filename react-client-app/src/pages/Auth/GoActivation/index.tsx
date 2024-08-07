import { memo, FC} from "react";
import styles from "./index.module.scss"
import Btn from "@/UI/Btn";
import { useNavigate } from "react-router-dom";

interface GoActivationProps {

}

const GoActivation:FC<GoActivationProps> = () => {

  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/registration')
  }

  return (
    <div className={styles.GoActivation}>
      <p>Вам на почту отправлено письмо.</p>
      <p>Перейдите по ссылке из письма и активируйте аккаунт</p>
      <div className={styles.error_container}>
        <Btn onClick={handleBack}>
          Назад
        </Btn>
      </div>
    </div>
  );
};

export default memo(GoActivation);
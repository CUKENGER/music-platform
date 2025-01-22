import styles from './GoActivateWidget.module.scss';
import { Link } from 'react-router-dom';

export const GoActivateWidget = () => {
  return (
    <div className={styles.GoActivate}>
      <p>Вам на почту отправлено письмо.</p>
      <p>Перейдите по ссылке из письма и активируйте аккаунт</p>
      <div>
        <Link to={'/registration'} className={styles.link}>
          Назад
        </Link>
      </div>
    </div>
  );
};

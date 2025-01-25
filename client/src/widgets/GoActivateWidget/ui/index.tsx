import styles from './GoActivateWidget.module.scss';
import { Link, useParams } from 'react-router-dom';

export const GoActivateWidget = () => {

  const {email} = useParams()

  return (
    <div className={styles.GoActivate}>
      <p>Вам на почту отправлено письмо.</p>
      <p>Перейдите по ссылке из письма и активируйте аккаунт</p>
      <p>{email}</p>
      <div>
        <Link to={'/registration'} className={styles.link}>
          Назад
        </Link>
      </div>
    </div>
  );
};

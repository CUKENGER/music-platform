import { Btn } from '@/shared/ui';
import styles from './GoActivateWidget.module.scss';
import { Link, useParams } from 'react-router-dom';

export const GoActivateWidget = () => {
  const { email } = useParams();

  return (
    <div className={styles.goActivate}>
      <p className={styles.text}>Вам на почту отправлено письмо.</p>
      <p className={styles.text}>Перейдите по ссылке из письма и активируйте аккаунт</p>
      <p className={styles.email}>{email}</p>
      <div className={styles.link_container}>
        <Link to={'/registration'}>
          <Btn>
            Назад
          </Btn>
        </Link>
      </div>
    </div>
  );
};

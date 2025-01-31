import styles from './SendEmail.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { FormEvent } from 'react';
import { useInput, useModal } from '@/shared/hooks';
import { useSendEmail } from '@/entities/user';
import { PUBLIC_ROUTES } from '@/shared/consts';
import { Btn, ModalContainer } from '@/shared/ui';

export const SendEmail = () => {
  const email = useInput('', { isEmpty: true, isEmail: true, isLatin: true });
  const { hideModal, modal, showModal } = useModal();
  const navigate = useNavigate();

  const { mutate: sendEmail, isPending: isLoading } = useSendEmail();

  const isValid = email.isEmpty || !email.isEmailValid || !email.isLatin;

  const handleSend = () => {
    if (isValid) {
      return;
    }

    const dto = {
      email: email.value.trim(),
    };

    sendEmail(dto, {
      onSuccess: () => {
        showModal(`Перейдите по ссылке из письма, отправленного на ${email.value}`, () => {
          navigate(PUBLIC_ROUTES.LOGIN);
        });
      },
      onError: (e: AxiosError) => {
        if (e.response && e.response.status === 404) {
          showModal('Пользователя с таким email не существует');
        } else {
          showModal(`Произошла ошибка, повторите позже ${e.message}`);
        }
      },
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  return (
    <div className={styles.SendEmail}>
      <form className={styles.container} onSubmit={handleSubmit}>
        <p className={styles.title}>Укажите Email</p>
        <p className={styles.text}>Введите свой email и вам придет ссылка для смены пароля</p>
        
        <Btn
          isLoading={isLoading}
          disabled={isValid}
          onClick={handleSend}
          type="submit"
        >
          Отправить
        </Btn>
        <Link to={PUBLIC_ROUTES.LOGIN} className={styles.link}>
          <Btn className={styles.btn}>
            Назад
          </Btn>
        </Link>
      </form>
      <ModalContainer modal={modal} hideModal={hideModal} />
    </div>
  );
};

import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './ResetPassword.module.scss';
import { AxiosError } from 'axios';
import { FormEvent } from 'react';
import { useInput, useModal } from '@/shared/hooks';
import { useResetPassword } from '@/entities/user';
import { PUBLIC_ROUTES } from '@/shared/consts';
import { Btn, ModalContainer } from '@/shared/ui';

export const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const password = useInput('', {
    isEmpty: true,
    isPasswordStrong: true,
    isLatin: true,
  });
  const repeatPassword = useInput(
    '',
    { isEmpty: true, isPasswordStrong: true, isLatin: true },
    password.value,
  );
  const { hideModal, modal, showModal } = useModal();
  const navigate = useNavigate();

  const isValid =
    !password.isEmpty &&
    password.isPasswordStrong &&
    password.isLatin &&
    repeatPassword.isPassEqual;

  const { mutate: resetPassword, isPending } = useResetPassword();

  const handleSend = () => {
    if (!isValid) {
      return;
    }

    if (token) {
      const dto = {
        token: token,
        newPassword: password.value,
      };
      resetPassword(dto, {
        onSuccess: () => {
          showModal(`Пароль успешно изменен`, () => {
            navigate(PUBLIC_ROUTES.LOGIN);
          });
        },
        onError: (e: AxiosError) => {
          console.log('e', e);
          showModal(`Произошла ошибка, повторите позже: ${e.message}`);
        },
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className={styles.ResetPassword}>
      <form className={styles.container} onSubmit={handleSubmit}>
        <p className={styles.title}>Смена пароля</p>
       
        <Btn
          isLoading={isPending}
          disabled={!isValid}
          onClick={handleSend}
          type="submit"
        >
          Сменить пароль
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

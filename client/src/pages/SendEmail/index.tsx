import styles from './SendEmail.module.scss'
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { FormEvent } from 'react';
import { useInput, useModal } from '@/shared/hooks';
import { useSendEmail } from '@/entities/user';
import { PUBLIC_ROUTES } from '@/shared/consts';
import { Btn, EmailInput, ModalContainer } from '@/shared/ui';

export const SendEmail = () => {

  const email = useInput("", { isEmpty: true, isEmail: true, isLatin: true });
  const { hideModal, modal, showModal } = useModal()
  const navigate = useNavigate()

  const { mutate: sendEmail, isPending: isLoading } = useSendEmail()

  const isValid = email.isEmpty || !email.isEmailValid || !email.isLatin;

  const handleSend = () => {
    if (isValid) {
      return
    }

    const dto = {
      email: email.value.trim()
    }

    sendEmail(dto, {
      onSuccess: () => {
        showModal(`Перейдите по ссылке из письма, отправленного на ${email.value}`, () => {
          navigate(PUBLIC_ROUTES.LOGIN)
        })
      },
      onError: (e: AxiosError) => {
        if (e.response && e.response.status === 404) {
          showModal('Пользователя с таким email не существует');
        } else {
          showModal(`Произошла ошибка, повторите позже ${e.message}`);
        }
      }
    })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const emailWarnings = [
    { condition: email.isDirty && email.isEmpty, message: 'Поле должно быть заполнено' },
    { condition: email.isDirty && !email.isEmailValid, message: 'Некорректный email' },
    { condition: email.isDirty && !email.isLatin, message: 'Поле заполняется латиницей' },
  ]

  return (
    <div className={styles.SendEmail}>
      <form className={styles.container} onSubmit={handleSubmit}>
        <p className={styles.title}>Укажите Email</p>
        <p className={styles.text}>Введите свой email и вам придет ссылка для смены пароля</p>
        <EmailInput
          name='email'
          inputValue={email}
          placeholder='Введите email'
          warnings={emailWarnings}
        />
        <Btn
          isLoading={isLoading}
          disabled={isValid}
          small={true}
          onClick={handleSend}
          type='submit'
        >
          Отправить
        </Btn>
        <Link to={PUBLIC_ROUTES.LOGIN} className={styles.link}>
          <Btn small={true} className={styles.btn}>
            Назад
          </Btn>
        </Link>
      </form>
        <ModalContainer
          modal={modal}
          hideModal={hideModal}
        />
    </div>
  )
}

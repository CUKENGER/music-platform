import { Btn, LoginInput, ModalContainer, PublicRoutes, useInput, useModal, WarningMessage } from '@/shared';
import styles from './SendEmail.module.scss'
import { Link, useNavigate } from 'react-router-dom';
import { useSendEmail } from '@/entities';
import { AxiosError } from 'axios';
import { FormEvent } from 'react';

export const SendEmail = () => {

  const email = useInput("", { isEmpty: true, isEmail: true, isLatin: true });
  const {hideModal, modal, showModal} = useModal()
  const navigate = useNavigate()

  const {mutate: sendEmail, isPending: isLoading} = useSendEmail()

  const isValid = email.isEmpty || !email.isEmailValid || !email.isLatin;

  const handleSend = () => {
    if(isValid) {
      return
    }

    const dto = {
      email: email.value.trim()
    }

    sendEmail(dto, {
      onSuccess: () => {
        showModal(`Перейдите по ссылке из письма, отправленного на ${email.value}`, () => {
          navigate(PublicRoutes.LOGIN)
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
  }

  return (
    <div className={styles.SendEmail}>
      <form className={styles.container} onSubmit={handleSubmit}>
        <p className={styles.title}>Укажите Email</p>
        <p className={styles.text}>Введите свой email и вам придет ссылка для смены пароля</p>
        <LoginInput
          name='email'
          inputValue={email}
          isEmpty={email.isEmpty}
          placeholder='Введите email'
          isEmail={true}
        />
        {email.isDirty && email.isEmpty && <WarningMessage text='Поле должно быть заполнено' />}
        {email.isDirty && !email.isEmailValid && <WarningMessage text='Некорректный email' />}
        {email.isDirty && !email.isLatin && <WarningMessage text='Поле заполняется латиницей' />}
        <Btn
          isLoading={isLoading}
          disabled={isValid}
          small={true}
          onClick={handleSend}
          type='submit'
        >
          Отправить
        </Btn>
        <Link to={PublicRoutes.LOGIN} className={styles.link}>
          <Btn small={true} className={styles.btn}>
            Назад
          </Btn>
        </Link>
      </form>
      {modal.isOpen && (
        <ModalContainer
          hideModal={hideModal}
          text={modal.message}
          onClick={modal.onClick}
        />
      )}
    </div>
  )
}
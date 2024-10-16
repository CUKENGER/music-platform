import { Btn, LoginInput, ModalContainer, PublicRoutes, useInput, useModal, WarningMessage } from "@/shared";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from './ResetPassword.module.scss'
import { useResetPassword } from "@/entities";
import { AxiosError } from "axios";
import { FormEvent } from "react";

export const ResetPassword = () => {

  const { token } = useParams<{ token: string }>();
  const password = useInput('', { isEmpty: true, isPasswordStrong: true, isLatin: true });
  const repeatPassword = useInput('', { isEmpty: true, isPasswordStrong: true, isLatin: true }, password.value);
  const {hideModal, modal, showModal} = useModal()
  const navigate = useNavigate()

  const isValid = !password.isEmpty && password.isPasswordStrong && password.isLatin && repeatPassword.isPassEqual;

  const {mutate: resetPassword, isPending} = useResetPassword()

  const handleSend = () => {
    if(!isValid) {
      return
    }

    if(token) {
      const dto = {
        token: token,
        newPassword: password.value
      }
      resetPassword(dto, {
        onSuccess: () => {
          showModal(`Пароль успешно изменен`, () => {
            navigate(PublicRoutes.LOGIN)
          })
        },
        onError: (e: AxiosError) => {
          console.log('e', e)
          showModal(`Произошла ошибка, повторите позже: ${e.message}`)
        }
      })
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
  }

  return (
    <div className={styles.ResetPassword}>
      <form className={styles.container} onSubmit={handleSubmit}>
        <p className={styles.title}>Смена пароля</p>
        <LoginInput
          inputValue={password}
          name='password'
          isEmpty={password.isEmpty}
          placeholder='Введите новый пароль'
        />
        {password.isDirty && password.isEmpty && <WarningMessage text="Поле должно быть заполнено" />}
        {password.isDirty && !password.isPasswordStrong && (
          <WarningMessage text="Пароль должен содержать минимум 8 символов, заглавные буквы и цифры" />
        )}
        {password.isDirty && !password.isLatin && <WarningMessage text="Поля заполняются латиницей" />}
        <LoginInput
          inputValue={repeatPassword}
          name="repeatPassword input"
          placeholder="Повторите новый пароль"
          isEmpty={repeatPassword.isEmpty}
        />
        {!repeatPassword?.isPassEqual && (
          <WarningMessage text="Пароли не совпадают" />
        )}
        <Btn 
          isLoading={isPending}
          disabled={!isValid} 
          small={true} 
          onClick={handleSend}
          type="submit"
        >
          Сменить пароль
        </Btn>
        <Link to={PublicRoutes.LOGIN} className={styles.link}>
          <Btn 
            small={true}
            className={styles.btn}
          >
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
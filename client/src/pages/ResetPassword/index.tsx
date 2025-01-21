import { Link, useNavigate, useParams } from "react-router-dom";
import styles from './ResetPassword.module.scss'
import { AxiosError } from "axios";
import { FormEvent } from "react";
import { useInput, useModal } from "@/shared/hooks";
import { useResetPassword } from "@/entities/user";
import { PUBLIC_ROUTES } from "@/shared/consts";
import { Btn, ModalContainer, PasswordInput } from "@/shared/ui";

export const ResetPassword = () => {

  const { token } = useParams<{ token: string }>();
  const password = useInput('', { isEmpty: true, isPasswordStrong: true, isLatin: true });
  const repeatPassword = useInput('', { isEmpty: true, isPasswordStrong: true, isLatin: true }, password.value);
  const { hideModal, modal, showModal } = useModal()
  const navigate = useNavigate()

  const isValid = !password.isEmpty && password.isPasswordStrong && password.isLatin && repeatPassword.isPassEqual;

  const { mutate: resetPassword, isPending } = useResetPassword()

  const handleSend = () => {
    if (!isValid) {
      return
    }

    if (token) {
      const dto = {
        token: token,
        newPassword: password.value
      }
      resetPassword(dto, {
        onSuccess: () => {
          showModal(`Пароль успешно изменен`, () => {
            navigate(PUBLIC_ROUTES.LOGIN)
          })
        },
        onError: (e: AxiosError) => {
          console.log('e', e)
          showModal(`Произошла ошибка, повторите позже: ${e.message}`)
        }
      })
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const passwordWarnings = [
    { 
      condition: password.isDirty && password.isEmpty, 
      message: "Поле должно быть заполнено" 
    },
    {
      condition: password.isDirty && !password.isPasswordStrong,
      message: "Пароль должен содержать минимум 8 символов, заглавные буквы и цифры"
    },
    { 
      condition: password.isDirty && !password.isLatin, 
      message: "Поля заполняются латиницей" 
    },
  ]

  const repeatPasswordWarnings = [
    {condition: !repeatPassword.isPassEqual, message: "Пароли не совпадают"}
  ]

  return (
    <div className={styles.ResetPassword}>
      <form className={styles.container} onSubmit={handleSubmit}>
        <p className={styles.title}>Смена пароля</p>
        <PasswordInput
          inputValue={password}
          name='password'
          placeholder='Введите новый пароль'
          warnings={passwordWarnings}
        />
        <PasswordInput
          inputValue={repeatPassword}
          name="repeatPassword input"
          placeholder="Повторите новый пароль"
          warnings={repeatPasswordWarnings}
        />
        <Btn
          isLoading={isPending}
          disabled={!isValid}
          small={true}
          onClick={handleSend}
          type="submit"
        >
          Сменить пароль
        </Btn>
        <Link to={PUBLIC_ROUTES.LOGIN} className={styles.link}>
          <Btn
            small={true}
            className={styles.btn}
          >
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

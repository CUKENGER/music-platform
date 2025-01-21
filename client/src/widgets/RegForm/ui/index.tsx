import { Link } from "react-router-dom"
import { useRegWidget } from "../model/useRegForm"
import { Btn, EmailInput, ModalContainer, PasswordInput, UITextField } from "@/shared/ui"
import { PUBLIC_ROUTES } from "@/shared/consts"
import { LoginLayout } from "@/widgets/LoginLayout"

export const RegForm = () => {
  const {
    email,
    password,
    username,
    handleSubmit,
    repeatPassword,
    isValid,
    isLoading,
    modal,
    hideModal
  } = useRegWidget()

  const usernameWarnings = [
    { condition: username.isEmpty, text: "Поле должно быть заполнено" },
    { condition: !username.isLatin, text: "Поля заполняются латиницей" },
    { condition: !username.isLengthValid, text: "Длина никнейма должна быть от 3 до 16 символов" },
  ]

  const emailWarnings = [
    { condition: email.isDirty && email.isEmpty, text: 'Поле должно быть заполнено' },
    { condition: email.isDirty && !email.isEmailValid, text: 'Некорректный emall' },
    { condition: email.isDirty && !email.isLatin, text: 'Поле заполняется латиницей' },
  ]

  const passwordWarnings = [
    { condition: password.isDirty && password.isEmpty, text: 'Поле должно быть заполнено' },
    { condition: password.isDirty && !password.isPasswordStrong, text: 'Пароль должен содержать минимум 8 символов, заглавные буквы и цифры' },
    { condition: password.isDirty && !password.isLatin, text: "Поля заполняются латиницей" }
  ]
  return (
    <>
      <LoginLayout
        handleSubmit={handleSubmit}
        title='Welcome'
      >

        <UITextField
          name="username"
          value={username.value}
          onChange={username.onChange}
          label="Введите никнейм"
          required
          warnings={usernameWarnings}
        />


        <EmailInput
          name='email'
          placeholder='Введите email'
          inputValue={email}
          warnings={emailWarnings}
        />
        <PasswordInput
          name='password'
          inputValue={password}
          placeholder='Введите пароль'
          warnings={passwordWarnings}
        />
        <PasswordInput
          name='repeatPassword'
          placeholder='Повторите пароль'
          inputValue={repeatPassword}
          warnings={[
            { condition: !repeatPassword?.isPassEqual, message: "Пароли не совпадают" }
          ]}
        />
        <Btn
          isLoading={isLoading}
          disabled={isValid}
          type='submit'
        >
          Зарегистрироваться
        </Btn>
        <Link to={PUBLIC_ROUTES.LOGIN}>
          <Btn>
            Авторизация
          </Btn>
        </Link>
      </LoginLayout>
      <ModalContainer
        modal={modal}
        hideModal={hideModal}
      />
    </>
  )
}

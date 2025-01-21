import { Btn, EmailInput, ModalContainer, PasswordInput } from '@/shared/ui'
import { useLoginWidget } from '../model/useLoginWidget'
import { LoginLayout } from '@/widgets/LoginLayout'
import { Link } from 'react-router-dom'
import { PUBLIC_ROUTES } from '@/shared/consts'

export const LoginWidget = () => {

  const {
    email,
    password,
    handleSubmit,
    isLoading,
    isValid,
    modal,
    hideModal
  } = useLoginWidget()

  const emailWarnings = [
    { condition: email.isDirty && email.isEmpty, message: 'Поле должно быть заполнено' },
    { condition: email.isDirty && !email.isEmailValid, message: 'Некорректный emall' },
    { condition: email.isDirty && !email.isLatin, message: 'Поле заполняется латиницей' },
  ]

  const passwordWarnings = [
    { condition: password.isDirty && password.isEmpty, message: 'Поле должно быть заполнено' },
    { condition: password.isDirty && !password.isPasswordStrong, message: 'Пароль должен содержать минимум 8 символов, заглавные буквы и цифры' },
    { condition: password.isDirty && !password.isLatin, message: "Поля заполняются латиницей" }
  ]

  return (
    <>
      <LoginLayout
        handleSubmit={handleSubmit}
        title='Welcome'
      >
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
        <Btn
          isLoading={isLoading}
          disabled={isValid}
          type='submit'
        >
          Зарегистрироваться
        </Btn>
        <Link to={PUBLIC_ROUTES.REGISTRATION}>
          <Btn>
            Регистрация
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

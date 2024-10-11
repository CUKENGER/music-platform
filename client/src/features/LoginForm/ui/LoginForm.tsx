import { FC, FormEvent, ReactNode } from 'react'
import styles from './LoginForm.module.scss'
import { WarningMessage, Btn, UseInputProps, PublicRoutes } from '@/shared';
import { LoginInput } from './LoginInput/LoginInput';
import { Link } from 'react-router-dom';

interface LoginFormProps {
  btnText: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children?: ReactNode;
  isLogin?: boolean;
  email: UseInputProps;
  password: UseInputProps;
  needRepeatPassword?: boolean;
  repeatPassword?: UseInputProps;
  isLoading?: boolean;
  isActiveBtn?: boolean
}

export const LoginForm: FC<LoginFormProps> = ({
  btnText, 
  handleSubmit, 
  children, 
  isLogin=true, 
  email, 
  password, 
  needRepeatPassword=false,
  repeatPassword,
  isLoading=false,
  isActiveBtn=true
}) => {

  return (
    <form className={styles.LoginForm} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Welcome</h1>
      {children}
      <LoginInput
        name='email'
        inputValue={email}
        isEmpty={email.isEmpty}
        placeholder='Введите email'
        isEmail={true}
      />
      {email.isDirty && email.isEmpty && <WarningMessage text='Поле должно быть заполнено'/>}
      {email.isDirty && !email.isEmailValid && <WarningMessage text='Некорректный emall'/>}
      {email.isDirty && !email.isLatin && <WarningMessage text='Поле заполняется латиницей'/>}
      <LoginInput
        inputValue={password}
        name='password'
        isEmpty={password.isEmpty}
        placeholder='Введите пароль'
      />
      {password.isDirty && password.isEmpty && <WarningMessage text="Поле должно быть заполнено"/>}
      {password.isDirty && !password.isPasswordStrong && (
        <WarningMessage text="Пароль должен содержать минимум 8 символов, заглавные буквы и цифры"/>
      )}
      {password.isDirty && !password.isLatin && <WarningMessage text="Поля заполняются латиницей"/>}

      {needRepeatPassword && repeatPassword && (
        <>
          <LoginInput
            inputValue={repeatPassword}
            name="repeatPassword input"
            placeholder="Повторите пароль"
            isEmpty={repeatPassword.isEmpty}
          />
          {!repeatPassword?.isPassEqual && (
            <WarningMessage text="Пароли не совпадают" />
          )}
        </>
      )}
      <Btn
        isLoading={isLoading}
        disabled={isActiveBtn}
        type='submit'
      >
        {btnText}
      </Btn>
      <Link to={isLogin ? PublicRoutes.REGISTRATION : PublicRoutes.LOGIN}>
        <Btn className={styles.reg_btn} type='button'>
          {isLogin ? 'Регистрация' : 'Авторизация'}
        </Btn>
      </Link>
      
    </form>
  )
}
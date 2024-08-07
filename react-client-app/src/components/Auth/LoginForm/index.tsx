import { memo, FC, ReactNode, FormEvent} from "react";
import styles from "./index.module.scss"
import { UseInputProps } from "@/hooks/useInput";
import InputString, { InputTypes } from "@/UI/InputString";
import Btn from "@/UI/Btn";
import InputCheckbox from "@/UI/InputCheckbox";
import { Link } from "react-router-dom";
import WarningMessage from "@/UI/WarningMessage";
import UploadBtn from "@/UI/UploadBtn";

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

const LoginForm:FC<LoginFormProps> = ({
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
      <h1 className={styles.title}>Welcome to NoteVomit!</h1>
      {children}
      <InputString
        name="email input"
        onChange={email.onChange}
        onBlur={email.onBlur}
        placeholder="Введите email"
        value={email.value}
        isEmpty={email.isEmpty}
        setValue={email.setValue}
        type={InputTypes.EMAIL}
      />
      {email.isDirty && email.isEmpty && 
        (<WarningMessage text="Поле должно быть заполнено"/>)}
      {email.isDirty && !email.isEmailValid && 
        (<WarningMessage text="Некорректный email"/>)}
      {email.isDirty && !email.isLatin && 
        (<WarningMessage text="Поля заполняются латиницей"/>)}
      <InputString
        name="password input"
        onChange={password.onChange}
        onBlur={password.onBlur}
        placeholder="Введите пароль"
        value={password.value}
        isEmpty={password.isEmpty}
        setValue={password.setValue}
        type={InputTypes.PASSWORD}
      />
      {needRepeatPassword && repeatPassword && (
        <>
          <InputString
            name="repeatPassword input"
            onChange={repeatPassword.onChange}
            onBlur={repeatPassword.onBlur}
            placeholder="Повторите пароль"
            value={repeatPassword.value}
            isEmpty={repeatPassword.isEmpty}
            setValue={repeatPassword.setValue}
            type={InputTypes.PASSWORD}
          />
          {!repeatPassword?.isPassEqual && (
            <WarningMessage text="Пароли не совпадают"/>
          )}
        </>
      )}
      {password.isDirty && password.isEmpty && <WarningMessage text="Поле должно быть заполнено"/>}
      {password.isDirty && !password.isPasswordStrong && (
        <WarningMessage text="Пароль должен содержать минимум 8 символов и цифры"/>
      )}
      {password.isDirty && !password.isLatin && <WarningMessage text="Поля заполняются латиницей"/>}
      <InputCheckbox
        placeholder="Запомнить меня"
      />
      <UploadBtn 
        isLoading={isLoading}
        isEmpty={isActiveBtn}
      >
        {btnText}
      </UploadBtn>
        <Link to={isLogin ? "/registration" : "/login"} className={styles.reg_btn}>
          <Btn className={styles.reg_btn}>
            {isLogin ? 'Регистрация' : 'Авторизация'}
          </Btn>
        </Link>
    </form>
  );
};

export default memo(LoginForm);
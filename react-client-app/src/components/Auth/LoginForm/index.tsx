import { memo, FC, ReactNode, FormEvent} from "react";
import styles from "./index.module.scss"
import { useInput } from "@/hooks/useInput";
import InputString from "@/UI/InputString";
import Btn from "@/UI/Btn";
import InputCheckbox from "@/UI/InputCheckbox";
import { Link } from "react-router-dom";

interface LoginFormProps {
  btnText: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children?: ReactNode;
  isLogin?: boolean
}

const LoginForm:FC<LoginFormProps> = ({btnText, handleSubmit, children, isLogin=true}) => {

  const email = useInput('', {isEmpty: true})
  const password = useInput('', {isEmpty: true})

  return (
    <form className={styles.LoginForm} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Welcome to NoteVomit!</h1>
      {children}
      <InputString
        onChange={email.onChange}
        onBlur={email.onBlur}
        placeholder="Введите email"
        value={email.value}
        isEmpty={email.isEmpty}
        setValue={email.setValue}
      />
      <InputString
        onChange={password.onChange}
        onBlur={password.onBlur}
        placeholder="Введите пароль"
        value={password.value}
        isEmpty={password.isEmpty}
        setValue={password.setValue}
        isPass={true}
      />
      <InputCheckbox
        placeholder="Запомнить меня"
      />
      <Btn isSubmit={true}>
        {btnText}
      </Btn>
      <Btn>
        <Link to={isLogin ? "/registration" : "/login"} className={styles.reg_btn}>
          {isLogin ? 'Регистрация' : 'Авторизация'}
        </Link>
      </Btn>
    </form>
  );
};

export default memo(LoginForm);
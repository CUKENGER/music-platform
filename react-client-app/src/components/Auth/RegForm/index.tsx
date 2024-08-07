import { memo, FC, FormEvent} from "react";
// import styles from "./index.module.scss"
import LoginForm from "../LoginForm";
import InputString, { InputTypes } from "@/UI/InputString";
import { UseInputProps } from "@/hooks/useInput";
import WarningMessage from "@/UI/WarningMessage";

interface RegFormProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  email: UseInputProps;
  password: UseInputProps;
  username: UseInputProps;
  repeatPassword: UseInputProps;
  isValid?: boolean;
  isLoading?: boolean
}

const RegForm:FC<RegFormProps> = ({handleSubmit, email, password, username , repeatPassword, isValid, isLoading}) => {

  return (
    <LoginForm 
      email={email}
      password={password}
      btnText="Зарегистрироваться" 
      handleSubmit={handleSubmit} 
      isLogin={false}
      needRepeatPassword={true}
      repeatPassword={repeatPassword}
      isLoading={isLoading}
      isActiveBtn={isValid}
    >
      <InputString
        name="username input"
        onChange={username.onChange}
        onBlur={username.onBlur}
        placeholder="Введите никнейм"
        value={username.value}
        isEmpty={username.isEmpty}
        setValue={username.setValue}
        type={InputTypes.TEXT}
      />
      {username.isDirty && username.isEmpty && <WarningMessage text="Поле должно быть заполнено"/>}
      {username.isDirty && !username.isLatin && <WarningMessage text="Поля заполняются латиницей"/>}
      {username.isDirty && !username.isLengthValid && <WarningMessage text="Длина никнейма должна быть от 3 до 16 символов"/>}
    </LoginForm>
  );
};

export default memo(RegForm);
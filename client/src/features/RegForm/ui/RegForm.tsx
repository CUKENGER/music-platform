import { UseInputProps} from '@/shared'
import { FC, FormEvent } from 'react';
import { LoginForm } from '../../LoginForm/ui/LoginForm';
import { InputWithWarn } from '@/shared/ui/InputWithWarn/InputWithWarn';

interface RegFormProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  email: UseInputProps;
  password: UseInputProps;
  username: UseInputProps;
  repeatPassword: UseInputProps;
  isValid?: boolean;
  isLoading?: boolean;
}

export const RegForm: FC<RegFormProps> = ({handleSubmit, email, password, username , repeatPassword, isValid, isLoading}) => {
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
      <InputWithWarn
        inputProps={username}
        name="username input"
        placeholder="Введите никнейм"
        warnings={[
          {condition: username.isDirty && username.isEmpty, message: "Поле должно быть заполнено"},
          {condition: username.isDirty && !username.isLatin, message: "Поля заполняются латиницей"},
          {condition: username.isDirty && !username.isLengthValid, message: "Длина никнейма должна быть от 3 до 16 символов"},
        ]}
      />
    </LoginForm>
  )
}
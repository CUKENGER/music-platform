import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Поле должно быть заполнено')
    .email('Некорректный email')
    .matches(/^[a-zA-Z0-9._%+-@]*$/, 'Поле заполняется латиницей'),
  password: yup
    .string()
    .required('Поле должно быть заполнено')
    .matches(/^[a-zA-Z0-9._%+-@]*$/, 'Поля заполняются латиницей')
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .matches(/[A-Z]/, 'Пароль должен содержать заглавные буквы')
    .matches(/[0-9]/, 'Пароль должен содержать цифры'),
});

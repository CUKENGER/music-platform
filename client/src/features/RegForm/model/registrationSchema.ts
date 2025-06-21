import * as yup from 'yup';

export const registrationSchema = yup.object().shape({
  username: yup
    .string()
    .required('Поле должно быть заполнено')
    .matches(/^[a-zA-Z0-9._%+-@]*$/, 'Поля заполняются латиницей')
    .min(3, 'Длина никнейма должна быть от 3 до 16 символов')
    .max(16, 'Длина никнейма должна быть от 3 до 16 символов'),
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
  repeatPassword: yup
    .string()
    .required('Поле должно быть заполнено')
    .oneOf([yup.ref('password')], 'Пароли не совпадают'),
});

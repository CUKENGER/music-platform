// src/entities/user/model/handleLoginError.ts
import { ErrorCode, ERROR_CODES } from '@/shared/consts/errorCodes';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  statusCode: number;
  message: string;
  code: ErrorCode;
  errors: Array<{
    field: string[];
    messages: string[];
  }>;
}

export const handleLoginErrorHandler = (error: unknown, showModal: (message: string) => void) => {
  console.error('Login error:', error);

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data as ApiErrorResponse | undefined;
    const message = data?.message || 'Произошла ошибка';
    const code = data?.code;

    switch (status) {
      case 400:
        if (code === ERROR_CODES.USER_NOT_FOUND) {
          showModal('Вы не зарегистрированы');
        } else {
          showModal(message || 'Некорректные данные.');
        }
        break;
      case 401:
        if (code === ERROR_CODES.INVALID_PASSWORD) {
          showModal('Неверный пароль.');
        } else {
          showModal('Ошибка авторизации.');
        }
        break;
      case 403:
        if (code === ERROR_CODES.ACCOUNT_NOT_ACTIVATED) {
          showModal('Аккаунт не активирован.');
        } else if (code === ERROR_CODES.ACCOUNT_BANNED) {
          showModal(message || 'Аккаунт заблокирован.');
        } else {
          showModal('Доступ запрещён.');
        }
        break;
      case 429:
        showModal('Слишком много попыток. Попробуйте позже.');
        break;
      case 500:
        showModal('Внутренняя ошибка сервера. Попробуйте позже.');
        break;
      default:
        showModal('Произошла неизвестная ошибка.');
        break;
    }
  } else {
    showModal('Не удалось подключиться к серверу. Проверьте соединение.');
  }
};

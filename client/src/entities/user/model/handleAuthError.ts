interface ResponseError {
  response: {
    data: {
      message: string;
    };
    status: number;
  };
}

export const isResponseError = (error: unknown): error is ResponseError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as ResponseError).response === 'object' &&
    typeof (error as ResponseError).response.status === 'number'
  );
};

export const handleAuthError = (error: unknown, showModal: (message: string) => void) => {
  if (isResponseError(error)) {
    const { status, data } = error.response;

    console.log('status', status)
    if (status === 409) {
      if (data.message.includes('email')) {
        showModal('Этот email уже занят');
      } else if (data.message.includes('username')) {
        showModal('Этот никнейм уже занят');
      } else {
        showModal(data.message || 'Некорректные данные. Попробуйте еще раз.');
      }
    } else if (status === 401) {
      showModal('Неверный логин или пароль.');
    } else {
      showModal('Произошла ошибка, повторите запрос позже.');
    }
  } else {
    showModal('Произошла ошибка, повторите запрос позже. ');
  }
};

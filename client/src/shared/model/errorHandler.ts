
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
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as ResponseError).response === "object" &&
    typeof (error as ResponseError).response.status === "number"
  );
};

export const handleErrorHandler = (error: unknown, showModal: (message: string) => void) => {
  console.error("Operation failed:", error);
  console.log('login error', error)

  if (isResponseError(error)) {
    if (error.response.status === 400) {
      showModal(error.response.data.message || "Некорректные данные. Попробуйте еще раз.");
    } else if (error.response.status === 401) {
      showModal("Неверный логин или пароль.");
    } else {
      showModal("Произошла ошибка, повторите запрос позже.");
    }
  } else {
    showModal("Произошла ошибка, повторите запрос позже. ");
  }
};

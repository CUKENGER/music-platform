import { axiosInstance } from "@/shared";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../api/useUserApi";
import { useUserStore } from "./userStore";

export const useAuthInterceptor = () => {
  const { mutate: logout } = useLogout();
  const { setIsAuth } = useUserStore();
  const navigate = useNavigate();

  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Отправляем запрос на обновление токена
          const { data } = await axiosInstance.post("/auth/refresh");
          
          // Обновляем токен
          localStorage.setItem("token", data.accessToken);
          
          // Повторяем оригинальный запрос с новым токеном
          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Если обновление токена не удалось, выполняем выход из системы и перенаправляем на страницу входа
          localStorage.removeItem('token');
          setIsAuth(false);
          logout(); // Можно обработать ошибку в `logout` функции
          navigate("/login");
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

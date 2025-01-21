import axios from 'axios';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../consts/apiUrl';
import { PUBLIC_ROUTES } from '../consts';
import { useUserStore } from '@/entities/user';

const accessToken = localStorage.getItem('token');

// Создание экземпляра axios
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  withCredentials: true,
});

const cookies = new Cookies();

// Настройка перехватчиков с помощью кастомного хука
export const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const { setIsAuth } = useUserStore();

  axiosInstance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { data } = await axiosInstance.get('/auth/refresh', { withCredentials: true });

          localStorage.setItem('token', data.accessToken);
          cookies.set('refreshToken', data.refreshToken, { 
            sameSite: 'strict',
            secure: true,
          });

          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (e) {
          console.error('Ошибка при обновлении токена:', e);
          cookies.remove('refreshToken');
          localStorage.removeItem('token');
          setIsAuth(false);
          navigate(PUBLIC_ROUTES.LOGIN);
          return Promise.reject(e);
        }
      }

      return Promise.reject(error);
    }
  );
};

//export default axiosInstance;

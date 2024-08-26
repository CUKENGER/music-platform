import axios from 'axios';
import { ApiUrl } from '../consts/apiUrl';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/entities';
import { PublicRoutes } from '../consts/routes';

// Создание экземпляра axios
const axiosInstance = axios.create({
  baseURL: ApiUrl,
  headers: {
    'Content-Type': 'application/json',
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
          const refreshToken = localStorage.getItem('refreshToken');
          cookies.set('refreshToken', refreshToken, { 
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
          });
          const { data } = await axiosInstance.get('/auth/refresh', { withCredentials: true });
          
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          cookies.set('refreshToken', data.refreshToken, { 
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
          });

          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (e) {
          cookies.remove('refreshToken');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          setIsAuth(false);
          navigate(PublicRoutes.LOGIN);
          return Promise.reject(e);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;

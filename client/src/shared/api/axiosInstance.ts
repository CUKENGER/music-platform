import axios from 'axios';
import { ApiUrl } from '../consts/apiUrl';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/entities';
import { PublicRoutes } from '../consts/routes';
import Cookies from 'universal-cookie';

const axiosInstance = axios.create({
  baseURL: ApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const cookies = new Cookies()

// Request interceptor for setting Authorization header
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.log('axiosInstance no token');
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    console.log('originalRequest', originalRequest);
    console.log('axiosInstance error', error);

    const isAuthRequest = originalRequest.url.includes('/auth/register') || originalRequest.url.includes('/auth/login');

    // Добавляем счетчик для отслеживания количества попыток обновления токена
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = false;

      // Счетчик попыток обновления токена
      if (!originalRequest._retryCount) {
        originalRequest._retryCount = 0;
      }

      // Проверяем, не достигли ли мы максимального количества попыток
      if (originalRequest._retryCount < 2) {
        originalRequest._retryCount += 1; // Увеличиваем счетчик попыток

        try {
          const refreshToken = localStorage.getItem('refreshToken')
          console.log('refreshToken from localStorage',refreshToken )
          cookies.set('refreshToken', refreshToken, { 
            // path: '/',
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
          });

          console.log('cookies',cookies)
          // Attempt to refresh the token
          const { data } = await axiosInstance.get('/auth/refresh', { withCredentials: true });
          console.log('axiosInstance data', data);
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          cookies.set('refreshToken',data.refreshToken, { 
            // path: '/',
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
          });
          console.log('new refreshToken from auth/refresh',data.refreshToken)

          // Retry the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (e) {
          cookies.remove('refreshToken')
          // If refreshing the token fails, logout and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken')
          return Promise.reject(e);
        }
      } else {
        // Если максимальное количество попыток достигнуто, можно выполнить дополнительные действия
        console.error('Maximum retry attempts reached. Please log in again.');
        // Например, удалить токены и перенаправить на страницу входа
        localStorage.removeItem('token');
        const navigate = useNavigate()
        const {setIsAuth} = useUserStore()
        setIsAuth(false)
        navigate(PublicRoutes.LOGIN)
        
        // Здесь можно добавить логику перенаправления на страницу входа
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
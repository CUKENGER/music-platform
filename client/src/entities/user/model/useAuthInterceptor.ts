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
          const { data } = await axiosInstance.post("/auth/refresh");
          
          localStorage.setItem("token", data.accessToken);
          
          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('token');
          setIsAuth(false);
          logout();
          navigate("/login");
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

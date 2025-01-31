import { PUBLIC_ROUTES } from '@/shared/consts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { handleLoginErrorHandler } from '../model/handleLoginError';
import { useUserStore } from '../model/userStore';
import {
  CreateUserDto,
  RegUserResponse,
  ResetPasswordDto,
  ResetPasswordResponse,
  SendEmailDto,
  SendEmailResponse,
} from '../types/User';
import {
  checkUsername,
  getByEmail,
  getByid,
  getByToken,
  loginUser,
  logoutUser,
  refreshToken,
  regUser,
  resetPassword,
  sendEmail,
} from './userApi';

const invalidateUserQuery = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({
    queryKey: ['user'],
    exact: true,
  });
};

const handleError = (error: unknown, context: string) => {
  if (error instanceof Error) {
    console.error(`Error ${context}:`, error.message);
  } else {
    console.error(`Unknown error ${context}:`, error);
  }
};

export const useRegUser = () => {
  const queryClient = useQueryClient();

  return useMutation<RegUserResponse, unknown, CreateUserDto>({
    mutationFn: regUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'], exact: true });
    },
  });
};

export const useLoginUser = (showModal: (message: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => invalidateUserQuery(queryClient),
    onError: (error: unknown) => handleLoginErrorHandler(error, showModal),
    retry: false,
    throwOnError: true,
  });
};

export const useGetByEmail = (email: string) => {
  // const queryClient = useQueryClient();

  return useQuery({
    queryFn: () => getByEmail(email),
    queryKey: ['user'],
  });
};

export const useGetUserById = (id: number) => {
  return useQuery({
    queryFn: () => getByid(id),
    queryKey: ['user', id],
  });
};

export const useGetByToken = () => {
  return useQuery({
    queryFn: () => getByToken(),
    queryKey: ['user'],
    // refetchOnWindowFocus: true,
    // refetchOnMount: false,
  });
};

export const useLogoutUser = () => {
  const { setIsAuth } = useUserStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setIsAuth(false);
      navigate(PUBLIC_ROUTES.LOGIN);
    },
    onError: (error) => {
      console.error('Ошибка при выходе:', error);
    },
  });
};

export const useCheckUsername = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkUsername,
    onSuccess: () => invalidateUserQuery(queryClient),
    onError: (error: unknown) => handleError(error, 'useCheckUsername'),
  });
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshToken,
    onSuccess: () => invalidateUserQuery(queryClient),
    onError: (error: unknown) => handleError(error, 'refreshing token'),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => invalidateUserQuery(queryClient),
    onError: (error: unknown) => handleError(error, 'refreshing token'),
  });
};

export const useSendEmail = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SendEmailResponse, // Тип данных, возвращаемых функцией мутации
    AxiosError, // Тип ошибки, например, AxiosError
    SendEmailDto, // Тип переменных, которые передаются функции мутации (в вашем случае, email)
    unknown // Тип контекста
  >({
    mutationFn: sendEmail,
    onSuccess: () => invalidateUserQuery(queryClient),
  });
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();

  return useMutation<ResetPasswordResponse, AxiosError, ResetPasswordDto, unknown>({
    mutationFn: resetPassword,
    onSuccess: () => invalidateUserQuery(queryClient),
  });
};

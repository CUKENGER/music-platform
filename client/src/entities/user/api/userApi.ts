import { apiRequest, axiosInstance } from '@/shared/api';
import axios from 'axios';
import {
  CheckUsernameResponse,
  CreateUserDto,
  IUser,
  LoginUserDto,
  LoginUserResponse,
  RegUserResponse,
  ResetPasswordDto,
  ResetPasswordResponse,
  SendEmailDto,
  SendEmailResponse,
} from '../types/User';

export const regUser = async (userDto: CreateUserDto): Promise<RegUserResponse> => {
  return apiRequest<RegUserResponse>('POST', 'user', { data: userDto });
};

export const getByEmail = async (email: string): Promise<IUser> => {
  return apiRequest<IUser>('GET', `user/${email}`, { data: email });
};

export const getByToken = async (): Promise<IUser> => {
  return apiRequest<IUser>('GET', 'user/byToken');
};

export const getAll = async (): Promise<IUser[]> => {
  return apiRequest<IUser[]>('get', 'user');
};

export const loginUser = async (userDto: LoginUserDto): Promise<LoginUserResponse> => {
  return apiRequest<LoginUserResponse>('post', 'auth/login', { data: userDto });
};

export const logoutUser = async (): Promise<string> => {
  return apiRequest<string>('post', 'auth/logout');
};

export const checkUsername = async (username: string): Promise<CheckUsernameResponse> => {
  return apiRequest<CheckUsernameResponse>('post', `user/check/${username}`)
  // try {
  //   const response = await axiosInstance.post(`user/check/${username}`, { params: username });
  //   return response.data;
  // } catch (e) {
  //   if (axios.isAxiosError(e)) {
  //     console.error('Error axios', e.message);
  //     throw e;
  //   } else {
  //     throw new Error('Неизвестная ошибка');
  //   }
  // }
};

export const refreshToken = async (): Promise<RegUserResponse> => {
  return apiRequest<RegUserResponse>('get', 'auth/refresh');
};

export const sendEmail = async (dto: SendEmailDto): Promise<SendEmailResponse> => {
  return apiRequest<SendEmailResponse>('post', 'auth/send_email', {
    data: dto,
  });
};

export const resetPassword = async (dto: ResetPasswordDto): Promise<ResetPasswordResponse> => {
  return apiRequest<ResetPasswordResponse>('post', 'auth/reset_password', {
    data: dto,
  });
};

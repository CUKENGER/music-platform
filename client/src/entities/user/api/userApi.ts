import { apiRequest } from "@/shared";
import { CheckUsernameResponse, CreateUserDto, IUser, LoginUserDto, RegUserResponse, ResetPasswordDto, ResetPasswordResponse, SendEmailDto, SendEmailResponse } from "../types/User";

export const regUser = async (userDto: CreateUserDto): Promise<RegUserResponse> => {
  return apiRequest<RegUserResponse>('post', 'user', userDto);
}

export const getByEmail = async (email: string): Promise<IUser> => {
  return apiRequest<IUser>('get', `user/${email}`, {email});
}

export const getByToken = async (): Promise<IUser> => {
  return apiRequest<IUser>('get', 'user/byToken');
}

export const getAll = async (): Promise<IUser[]> => {
  return apiRequest<IUser[]>('get', 'user');
}

export const loginUser = async (userDto: LoginUserDto): Promise<RegUserResponse> => {
  return apiRequest<RegUserResponse>('post', 'auth/login', userDto);
}

export const logoutUser = async (): Promise<string> => {
  return apiRequest<string>('post', 'auth/logout');
}

export const checkUsername = async (username: string): Promise<CheckUsernameResponse> => {
  return apiRequest<CheckUsernameResponse>('post', `user/check/${username}`, {username});
}

export const refreshToken = async (): Promise<RegUserResponse> => {
  return apiRequest<RegUserResponse>('get', 'auth/refresh');
}

export const sendEmail = async (dto: SendEmailDto): Promise<SendEmailResponse> => {
  return apiRequest<SendEmailResponse>('post', 'auth/send_email', dto);
}

export const resetPassword = async (dto: ResetPasswordDto): Promise<ResetPasswordResponse> => {
  return apiRequest<ResetPasswordResponse>('post', 'auth/reset_password', dto);
}

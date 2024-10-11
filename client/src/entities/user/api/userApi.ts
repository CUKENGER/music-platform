import { axiosInstance } from "@/shared";
import { CreateUserDto, IUser, LoginUserDto, RegUserResponse } from "../types/User";


export const regUser = async (userDto: CreateUserDto):Promise<RegUserResponse> => {
  try {
    const response = await axiosInstance.post<RegUserResponse>(`user`, userDto)
    return response.data
  } catch (error) {
    console.error('Error reg user:', error);
    throw error;
  }
}

export const getByEmail = async (email: string): Promise<IUser> => {
  try {
    const response = await axiosInstance.get(`user/${email}`)
    return response.data
  } catch(e) {
    console.error('Error getByEmail', e);
    throw e
  }
}

export const getByToken = async (): Promise<IUser> => {
  try {
    const response = await axiosInstance.get(`user/byToken`)
    return response.data
  } catch(e) {
    console.error('Error getByToken', e);
    throw e
  }
}

export const getAll = async (): Promise<IUser[]> => {
  try {
    const response = await axiosInstance.get(`user`)
    return response.data
  } catch(e) {
    console.error('Error getAll', e);
    throw e
  }
}


export const loginUser = async (userDto: LoginUserDto): Promise<RegUserResponse> => {
  try {
    const response = await axiosInstance.post<RegUserResponse>('auth/login', userDto)
    return response.data
  } catch(e) {
    console.error('Error loginUser', e);
    throw e
  }
}

export const logoutUser = async (): Promise<string> => {
  try {
    const response = await axiosInstance.post('auth/logout')
    return response.data
  } catch(e) {
    console.error('Error logoutUser', e);
    throw e
  }
}

interface CheckUsernameResponse {
  available: boolean
}

export const checkUsername = async (username: string): Promise<CheckUsernameResponse> => {
  try {
    const response = await axiosInstance.post(`user/check/${username}`)
    return response.data
  } catch(e) {
    console.error('Error checkUsername', e);
    throw e
  }
}


export const refreshToken = async (): Promise<RegUserResponse> => {
  try {
    const response = await axiosInstance.get('auth/refresh')
    return response.data
  } catch(e) {
    console.error('Error refreshToken', e);
    throw e
  }
}


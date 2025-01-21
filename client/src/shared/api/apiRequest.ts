import axios, { AxiosError, Method } from "axios";
import { ErrorResponse } from "react-router-dom";
import {axiosInstance} from "./axiosInstance";

interface ApiRequestOptions<T = unknown> {
  params?: Record<string, string | number | boolean>;
  data?: T;
  headers?: Record<string, string>;
}

export interface RequestError {
  message: string;
  error?: AxiosError<ErrorResponse>;
}

export const apiRequest = async <T, D = unknown>(
  method: Method,
  url: string,
  options: ApiRequestOptions<D> = {}
): Promise<T> => {
  try {
    const response = await axiosInstance.request<T>({
      method,
      url,
      params: options.params,
      data: options.data,
      headers: options.headers,
    });
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.error('Axios error:', e.response?.data || e.message);
      throw e;
    } else {
      console.error('Unknown error:', e);
      throw new Error('Неизвестная ошибка');
    }
  }
};

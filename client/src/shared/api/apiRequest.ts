import axios from "axios";
import axiosInstance from "./axiosInstance";

export const apiRequest = async <T>(
  method: 'get' | 'post' | 'delete' | 'put',
  url: string,
  data?: unknown,
  params?: Record<string, unknown>
): Promise<T> => {
  try {
    let response;

    switch (method) {
      case 'get':
        response = await axiosInstance.get<T>(url, { params });
        break;
      case 'post':
        response = await axiosInstance.post<T>(url, data);
        break;
      case 'delete':
        response = await axiosInstance.delete<T>(url, { params });
        break;
      case 'put':
        response = await axiosInstance.put<T>(url, data);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response.data;

  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e;
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
};
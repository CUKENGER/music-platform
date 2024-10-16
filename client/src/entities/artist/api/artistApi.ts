import { apiRequest, axiosInstance } from "@/shared";
import { CreateArtistDto, IArtist } from "../types/Artist";
import axios from "axios";

export const getAll = async (count?: number): Promise<IArtist[]> => {
  try {
    const response = await axiosInstance.get('artists', {
      params: {count: count}
    })
    return response.data
  } catch(e) {
    if (axios.isAxiosError(e)) {
      throw e;
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
}

export const getOne = async (id: number): Promise<IArtist | null> => {
  return apiRequest<IArtist | null>('get', `artists`, { id });
}

export const search = async (name: string): Promise<IArtist[]> => {
  try {
    const response = await axiosInstance.get('artists/search', {
      params: {
        name: name
      }
    });
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e;
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
}

export const create = async (artistInfo: CreateArtistDto) => {
  try {

    const fd = new FormData()

    fd.append('name', artistInfo.name);
    fd.append('genre', artistInfo.genre);
    fd.append('description', artistInfo.description);
    fd.append('picture', artistInfo.picture)

    const response = await axiosInstance.post('/artists', fd, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e;
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }

}


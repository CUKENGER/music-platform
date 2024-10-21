import { apiRequest, axiosInstance } from "@/shared"
import { CreateTrackDto, ITrack } from "../types/Track";
import axios from "axios";

export const getAll = async (page: number = 0, count: number = 20): Promise<ITrack[]> => {
  try {
    const response = await axiosInstance.get('tracks', {
      params: {
        page: page,
        count: count,
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
};

export const getOne = async (trackId: number): Promise<ITrack | null> => {
  return apiRequest<ITrack>('get', `tracks/${trackId}`, {id: trackId});
}

export const addLike = async (id: number): Promise<ITrack | null> => {
  return apiRequest<ITrack>('post', `tracks/${id}/like`, {id});
}

export const deleteLike = async (id: number): Promise<ITrack | null> => {
  return apiRequest<ITrack>('delete', `tracks/${id}/like`, {id});
}

export const addListen = async (id: number): Promise<ITrack | null> => {
  return apiRequest<ITrack>('post', `tracks/${id}/listen`, {id});
}

export const deleteTrack = async (id: number): Promise<ITrack | null> => {
  return apiRequest<ITrack>('delete', `tracks/${id}`, {id});
}

export const create = async (trackInfo: CreateTrackDto): Promise<ITrack> => {
  try {
    const formData = new FormData();
    
    formData.append('name', trackInfo.name);
    formData.append('artist', trackInfo.artist);
    formData.append('text', trackInfo.text);
    formData.append('genre', trackInfo.genre);
    formData.append('picture', trackInfo.picture);
    formData.append('audio', trackInfo.audio);


    const response = await axiosInstance.post('/tracks', formData, {
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
};


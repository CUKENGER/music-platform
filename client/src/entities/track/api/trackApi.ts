import { apiRequest, axiosInstance } from '@/shared/api';
import axios from 'axios';
import { CreateTrackDto, ITrack } from '../types/Track';

interface GetAllTrackResponse {
  data: ITrack[];
  hasNextPage: boolean;
}

export const getAll = async ({ pageParam = 0, sortBy = 'Все' }): Promise<GetAllTrackResponse> => {
  try {
    const response = await axiosInstance.get('tracks', {
      params: {
        page: pageParam,
        count: 20,
        sortBy: sortBy,
      },
    });
    return {
      data: response.data.data,
      hasNextPage: response.data.hasNextPage,
    };
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e;
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
};

export const getOne = async (trackId: number): Promise<ITrack | null> => {
  return apiRequest<ITrack>('get', `tracks/${trackId}`, {
    params: { id: trackId },
  });
};

export const addLike = async (id: number): Promise<ITrack | null> => {
  return apiRequest<ITrack>('post', `tracks/${id}/like`, { params: { id } });
};

export const deleteLike = async (id: number): Promise<ITrack | null> => {
  return apiRequest<ITrack>('delete', `tracks/${id}/like`, { params: { id } });
};

export const addListen = async (id: number): Promise<ITrack | null> => {
  return apiRequest<ITrack>('post', `tracks/${id}/listen`, { params: { id } });
};

export const deleteTrack = async (id: number): Promise<ITrack> => {
  return apiRequest<ITrack>('delete', `tracks/${id}`, { params: { id } });
};

export const create = async (trackInfo: CreateTrackDto): Promise<ITrack> => {
  try {
    const formData = new FormData();

    formData.append('name', trackInfo.name);
    formData.append('artist', trackInfo.artist);
    formData.append('text', trackInfo.text);
    formData.append('genre', trackInfo.genre);
    formData.append('picture', trackInfo.picture);
    formData.append('audio', trackInfo.audio);

    console.log('trackInfo', trackInfo);

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

export const getFullAudio = async (filename: string) => {
  try {
    const response = await axiosInstance.get(`/audio/${filename}`, {});
    console.log('response', response);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e;
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
};

export const getLimitPopular = async (): Promise<ITrack[]> => {
  try {
    const response = await axiosInstance.get('tracks/limit_popular');
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e;
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
};

export const getAllPopular = async (): Promise<ITrack[]> => {
  try {
    const response = await axiosInstance.get('tracks/all_popular');
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e;
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
};

export const getLyrics = async (name: string, artist: string): Promise<string> => {
  try {
    let lyricsResponse;

    const response = await axiosInstance.get('lyrics/search', {
      params: { track_name: name, artist_name: artist },
    });

    if (response.data.track_id) {
      lyricsResponse = await axiosInstance.get(`lyrics?track_id=${response.data.track_id}`);
    }
    return lyricsResponse?.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e;
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
};

import { apiRequest, axiosInstance } from '@/shared/api';
import axios, { AxiosError } from 'axios';
import { CreateTrackDto, ITrack } from '../types/Track';

export const getAll = async ({ pageParam = 0, sortBy = 'Все' }): Promise<ITrack[]> => {
  try {
    const response = await axiosInstance.get('tracks', {
      params: {
        page: pageParam,
        count: 20,
        sortBy: sortBy,
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

export const getAudioChunks = async (filename: string, start: number, end: number) => {
  try {
    const response = await axiosInstance.get(`/audio/${filename}`, {
      headers: { Range: `bytes=${start}-${end}` },
      responseType: 'arraybuffer',
    });
    const contentRange = response.headers['content-range'];
    if (!contentRange) {
      throw new Error('Content-Range header is missing');
    }
    const totalSize = contentRange.split('/')[1];
    const fileSize = parseInt(totalSize, 10);
    if ('x-chunk-duration' in response.headers && fileSize) {
      const chunkDurationStr = response.headers['x-chunk-duration'];
      const chunkDuration = parseInt(chunkDurationStr, 10);
      return { data: response.data, chunkDuration, fileSize };
    } else {
      console.error('X-Chunk-Duration header missing');
      return { data: response.data, chunkDuration: NaN };
    }
  } catch (e) {
    console.log('error audioChunks get ', e);
    if (e instanceof AxiosError && e.response?.status === 416) {
      throw new Error('Range not satisfiable');
    }
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

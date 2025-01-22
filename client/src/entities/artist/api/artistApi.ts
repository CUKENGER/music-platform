import { axiosInstance } from '@/shared/api';
import { CreateArtistDto, IArtist } from '../types/Artist';
import axios from 'axios';

export const getAll = async ({ pageParam = 0, sortBy = 'Все' }): Promise<IArtist[]> => {
  try {
    const response = await axiosInstance.get('artists', {
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

export const getOne = async (id: number): Promise<IArtist> => {
  try {
    const response = await axiosInstance.get(`artists/${id}`);
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e;
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
};

export const getPopularTracks = async (id: number): Promise<IArtist> => {
  try {
    const response = await axiosInstance.get(`artists/${id}/popular_tracks`);
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e;
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
};

export const search = async (name: string): Promise<IArtist[]> => {
  try {
    const response = await axiosInstance.get('artists/search', {
      params: {
        name: name,
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

export const create = async (artistInfo: CreateArtistDto) => {
  try {
    const fd = new FormData();

    fd.append('name', artistInfo.name);
    fd.append('genre', artistInfo.genre);
    fd.append('description', artistInfo.description);
    fd.append('picture', artistInfo.picture);

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
};

export const deleteArtist = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`artists/${id}`);
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e;
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
};

export const update = async (artistInfo: CreateArtistDto, id: number) => {
  try {
    const fd = new FormData();

    fd.append('name', artistInfo.name);
    fd.append('genre', artistInfo.genre);
    fd.append('description', artistInfo.description);
    fd.append('picture', artistInfo.picture);

    const response = await axiosInstance.put(`artists/${id}`, fd, {
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

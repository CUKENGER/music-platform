import { axiosInstance } from "@/shared"
import { CreateTrackDto, ITrack } from "../types/Track";

export const getAll = async (count?: number, offset?: number) => {
  try {
    const response = await axiosInstance.get('/tracks', { params: { count, offset }});
    return response.data
  } catch (e: unknown) {
    console.error(`Error fetching tracks: ${e}`);
    return null
  }
};

export const getOne = async (trackId: number): Promise<ITrack | null> => {
  try {
    const response = await axiosInstance.get<ITrack>(`/tracks/${trackId}`, { params: { id: Number(trackId) }});
    return response.data
  } catch (e: unknown) {
    console.error(`Error get one track: ${e}`);
    return null
  }
};

export const addLike = async (id: number): Promise<ITrack | null> => {
  try {
    const response = await axiosInstance.post(`/tracks/like/${id}`)
    return response.data
  } catch(e) {
    console.error(`error post like track axios, ${e}`)
    return null;
  }
}

export const addListen = async (id: number): Promise<ITrack | null> => {
  try {
    const response = await axiosInstance.post(`/tracks/listen/${id}`)
    return response.data
  } catch(e) {
    console.error(`error add listen track axios, ${e}`)
    return null;
  }
}


export const deleteLike = async (id: number): Promise<ITrack | null> => {
  try {
    const response = await axiosInstance.delete(`/tracks/like/${id}`)
    return response.data
  } catch(e) {
    console.error(`error delete like track axios, ${e}`)
    return null;
  }
}

export const deleteTrack = async (id: number): Promise<ITrack | null> => {
  try {
    const response = await axiosInstance.delete(`/tracks/${id}`)
    return response.data
  } catch(e) {
    console.error(`error delete track axios, ${e}`)
    return null;
  }
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
  } catch (error) {
    console.error('Error create track:', error);
    throw error;
  }
};


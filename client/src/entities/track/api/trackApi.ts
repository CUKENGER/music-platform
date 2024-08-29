import { axiosInstance } from "@/shared"
import { CreateTrackDto, ITrack } from "../types/Track";

export const deleteTrack = async (trackId: number): Promise<ITrack> => {
  try {
    const response = await axiosInstance.delete(`/tracks/${trackId}`)
    return response.data
  } catch (error) {
    console.error('Error delete track:', error);
    throw error;
  }
}

export const create = async (trackInfo: CreateTrackDto) => {
  try {
    const formData = new FormData();
    
    formData.append('name', trackInfo.name);
    formData.append('artist', trackInfo.artist);
    formData.append('text', trackInfo.text);
    formData.append('genre', trackInfo.genre);
    formData.append('picture', trackInfo.picture);
    formData.append('audio', trackInfo.audio);

    console.log('formData', formData);

    const response = await axiosInstance.post('/tracks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('response', response)

    return response.data;
  } catch (error) {
    console.error('Error create track:', error);
    throw error;
  }
};


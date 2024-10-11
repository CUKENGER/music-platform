import { axiosInstance } from "@/shared";
import { CreateArtistDto, IArtist } from "../types/Artist";

export const getAll = async (count?: number, offset?: number) => {
  try {
    const response = await axiosInstance.get('/artists', { params: { count, offset }});
    return response.data
  } catch (e: unknown) {
    console.error(`Error fetching artists: ${e}`);
    return null
  }
};

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
  } catch (error) {
    console.error('Error create artist:', error);
    throw error;
  }

}

export const getOne = async (id: number) => {
  try {
    const response = await axiosInstance.get<IArtist>(`/artists/${id}`);
    return response.data
  } catch (e: unknown) {
    console.error(`Error get artist: ${e}`);
    return null
  }
};

export const search = async (name: string) => {
  try {
    const response = await axiosInstance.get<IArtist[]>(`/artists/search`, {params: {name}});
    return response.data
  } catch (e: unknown) {
    console.error(`Error search artist: ${e}`);
    return null
  }
};


import { axiosInstance } from "@/shared";
import { CreateAlbumDto, IAlbum } from "../types/Album";
import { IComment } from "@/entities";
import { CreateCommentDto } from "@/entities/comment/types/Comment";

export const getAll = async (count?: number, offset?: number) => {
  try {
    const response = await axiosInstance.get('/albums', { params: { count, offset }});
    return response.data
  } catch (e: unknown) {
    console.error(`Error fetching albums: ${e}`);
    return null
  }
};

export const create = async (albumInfo: CreateAlbumDto) => {
  try {

    const fd = new FormData()

    fd.append('artist', albumInfo.artist);
    fd.append('name', albumInfo.name);
    fd.append('picture', albumInfo.picture ?? '');
    fd.append('genre', albumInfo.genre);
    fd.append('description', albumInfo.description);
    fd.append('releaseDate', albumInfo.releaseDate);


    albumInfo?.tracks.forEach((track) => {
      if (track?.audio) {
        fd.append(`tracks`, track.audio);
      }
    });

    albumInfo.track_names.forEach((name, index) => {
      fd.append(`track_names[${index}]`, name);
    });

    albumInfo.track_texts.forEach((text, index) => {
      fd.append(`track_texts[${index}]`, text);
    });

    const response = await axiosInstance.post('/albums', fd, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error create album:', error);
    throw error;
  }

}

export const getOne = async (id: number | undefined) => {
  if(!id) {
    console.error('AlbumId not found')
    return null
  }
  try {
    const response = await axiosInstance.get<IAlbum>(`/albums/${id}`);
    return response.data
  } catch (e: unknown) {
    console.error(`Error get album: ${e}`);
    return null
  }
};

export const getComments = async (id: number) => {
  try {
    const response = await axiosInstance.get<[IComment]>(`/albums/${id}/comment`)
    return response.data
  } catch(e) {
    console.error('Error getAlbumComments', e)
    return null
  }
}

export const addComment = async (dto: CreateCommentDto) => {
  try {
    const response = await axiosInstance.post<IComment>(`/albums/comment`, dto)
    return response.data
  } catch(e) {
    console.error('Error add AlbumComment', e)
    return null
  }
}

export const addLike = async (id: number): Promise<IAlbum | null> => {
  try {
    const response = await axiosInstance.post(`/albums/like/${id}`)
    return response.data
  } catch(e) {
    console.error(`error post like album axios, ${e}`)
    return null;
  }
}

export const deleteLike = async (id: number): Promise<IAlbum | null> => {
  try {
    const response = await axiosInstance.delete(`/albums/like/${id}`)
    return response.data
  } catch(e) {
    console.error(`error delete like album axios, ${e}`)
    return null;
  }
}

export const deleteAlbum = async (id: number | undefined): Promise<IAlbum | null> => {
  if(!id) {
    console.error('AlbumId not found')
    return null
  }
  try {
    const response = await axiosInstance.delete(`/albums/${id}`)
    return response.data
  } catch(e) {
    console.error(`Error delete album axios, ${e}`)
    return null;
  }
}


import { apiRequest, axiosInstance } from "@/shared";
import { CreateAlbumDto, IAlbum } from "../types/Album";
import { IComment } from "@/entities";
import { CreateCommentDto } from "@/entities/comment/types/Comment";
import axios from "axios";

export const getAll = async (count?: number, offset?: number): Promise<IAlbum[]> => {
  return apiRequest<IAlbum[]>('get', `albums`, {count, offset});
}

export const getOne = async (id: number): Promise<IAlbum> => {
  return apiRequest<IAlbum>('get', `albums/${id}`, {id});
}

export const getComments = async (id: number): Promise<IComment[]> => {
  return apiRequest<IComment[]>('get', `albums/${id}/comment`, {id});
}

export const addComment = async (dto: CreateCommentDto): Promise<IComment> => {
  return apiRequest<IComment>('post', `albums/comment`, dto);
}

export const addLike = async (id: number): Promise<IAlbum> => {
  return apiRequest<IAlbum>('post', `albums/${id}/like`, {id});
}

export const deleteLike = async (id: number): Promise<IAlbum> => {
  return apiRequest<IAlbum>('delete', `albums/${id}/like`, {id});
}

export const deleteAlbum = async (id: number): Promise<IAlbum> => {
  return apiRequest<IAlbum>('delete', `albums/${id}`, {id});
}

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
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e;
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }

}


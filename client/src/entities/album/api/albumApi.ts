import { CreateAlbumDto, EditAlbumDto, IAlbum } from "../types/Album";
import { CreateCommentDto, IComment } from "@/entities/comment/types/Comment";
import { apiRequest, axiosInstance } from "@/shared/api";
import axios from "axios";

export const getAll = async ({ pageParam = 0, sortBy = 'Все' }): Promise<IAlbum[]> => {
  try {
    const response = await axiosInstance.get('albums', {
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

export const getOne = async (id: number): Promise<IAlbum> => {
  return apiRequest<IAlbum>('get', `albums/${id}`, { params: { id } });
}

export const getComments = async (id: number): Promise<IComment[]> => {
  return apiRequest<IComment[]>('get', `albums/${id}/comment`, { params: { id } });
}

export const addComment = async (dto: CreateCommentDto): Promise<IComment> => {
  return apiRequest<IComment>('post', `albums/comment`, { data: dto });
}

export const addLike = async (id: number): Promise<IAlbum> => {
  return apiRequest<IAlbum>('post', `albums/${id}/like`, { params: { id } });
}

export const deleteLike = async (id: number): Promise<IAlbum> => {
  return apiRequest<IAlbum>('delete', `albums/${id}/like`, { params: { id } });
}

export const deleteAlbum = async (id: number | undefined): Promise<IAlbum> => {
  if (!id) throw new Error('ID is required');
  return apiRequest<IAlbum>('delete', `albums/${id}`, { params: { id } });
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

export const getLimitPopular = async (): Promise<IAlbum[]> => {
  try {
    const response = await axiosInstance.get('albums/limit_popular');
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e;
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
}

export const getAllPopular = async (): Promise<IAlbum[]> => {
  try {
    const response = await axiosInstance.get('albums/all_popular');
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e;
    } else {
      throw new Error('Неизвестная ошибка');
    }
  }
}

export const updateAlbum = async (id: number | undefined, albumInfo: EditAlbumDto): Promise<IAlbum> => {
  try {
    const fd = new FormData();

    console.log('albumInfo', albumInfo);

    fd.append('artist', albumInfo.artist);
    fd.append('name', albumInfo.name);
    fd.append('picture', albumInfo.picture ?? '');
    fd.append('genre', albumInfo.genre);
    fd.append('description', albumInfo.description);
    fd.append('releaseDate', albumInfo.releaseDate);

    albumInfo.tracks.forEach((track, index) => {
      fd.append(`tracks[${index}][name]`, track.name);
      fd.append(`tracks[${index}][text]`, track.text);
      fd.append(`tracks[${index}][isNew]`, String(track?.isNew));
      fd.append(`tracks[${index}][isUpdated]`, String(track?.isUpdated));
      fd.append(`tracks[${index}][id]`, track?.id?.toString() ?? '');
      if (track.audio) {
        if (track.id) {
          fd.append(`tracks[${track.id}][audio]`, track.audio);
        } else {
          fd.append(`newTracks`, track.audio);
        }
      }
    });

    albumInfo.deletedTracks.forEach((track, index) => {
      if (track.id) {
        fd.append(`deletedTracks[${index}][id]`, track.id.toString());
      }
    });

    console.log('fd', fd);

    const response = await axiosInstance.put(`albums/${id}`, fd, {
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

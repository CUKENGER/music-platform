import { apiRequest } from "@/shared";
import { IComment } from "../types/Comment";


export const addLike = async (id: number): Promise<IComment | null> => {
  return apiRequest<IComment | null>('post', `comments/${id}/like`, {id});
}

export const deleteLike = async (id: number): Promise<IComment | null> => {
  return apiRequest<IComment | null>('delete', `comments/${id}/like`, {id});
}


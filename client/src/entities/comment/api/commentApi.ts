import { axiosInstance } from "@/shared";
import { IComment } from "../types/Comment";


export const addLike = async (id: number): Promise<IComment | null> => {
  try {
    const response = await axiosInstance.post(`/comments/${id}/like`)
    return response.data
  } catch(e) {
    console.error(`error post like comment axios, ${e}`)
    return null;
  }
}

export const deleteLike = async (id: number): Promise<IComment | null> => {
  try {
    const response = await axiosInstance.delete(`/comments/${id}/like`)
    return response.data
  } catch(e) {
    console.error(`error delete like comment axios, ${e}`)
    return null;
  }
}

import { axiosInstance } from "@/shared"
import { ITrack } from "../types/Track";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteTrack = async (trackId: number): Promise<ITrack> => {
  try {
    const response = await axiosInstance.delete(`/tracks/${trackId}`)
    return response.data
  } catch (error) {
    console.error('Error delete track:', error);
    throw error;
  }
}

export const useDeleteTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tracks'],
        exact: true,
      });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error deleting track:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
    },
  });
};

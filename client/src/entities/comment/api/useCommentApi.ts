import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLike, deleteLike } from "./commentApi";


export const useAddLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => addLike(commentId),
    mutationKey: ['comment', 'like'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments'],
      });
    },
  });
};

export const useDeleteLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (albumId: number) => deleteLike(albumId),
    mutationKey: ['comment', 'dislike'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments'],
      });
    },
  });
};
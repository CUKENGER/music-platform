import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addComment, addLike, create, deleteAlbum, deleteLike, getAll, getComments, getOne } from "./albumApi";
import { CreateAlbumDto, IAlbum } from "../types/Album";
import { CreateCommentDto, IComment } from "@/entities/comment/types/Comment";

export const useGetAllAlbums = (count?: number, offset?: number) => {

  return useQuery({
    queryKey: ['albums', count, offset],
    queryFn: () => getAll(count, offset),
    // placeholderData: (prev) => prev,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateAlbum = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (albumInfo: CreateAlbumDto) => create(albumInfo),
    mutationKey: ['albums', 'create'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['albums'],
      });
    },
  })
}

export const useGetOneAlbum = (id: number | undefined) => {

  return useQuery({
    queryKey: ['albums', id],
    queryFn: () => getOne(id),
    placeholderData: (prev) => prev,
    // placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetCommentsAlbum = (id: number) => {

  return useQuery({
    queryKey: ['albums', 'comments', id],
    queryFn: () => getComments(id),
    // placeholderData: (prev) => prev,
    // placeholderData: keepPreviousData,
    // staleTime: 1000 * 60 * 5,
  });
};

export const useCreateAlbumComment = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCommentDto) => addComment(dto),
    mutationKey: ['albums','comment','create'],
    onSuccess: (newComment) => {
      queryClient.setQueryData(['albums', 'comments', newComment?.albumId], (oldComments: IComment[] | undefined) => {
        return [...(oldComments || []), newComment];
      });

      queryClient.invalidateQueries({
        queryKey: ['albums', 'comments'],
        exact: false,
      });
    },
  })
}

export const useAddLikeAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (albumId: number) => addLike(albumId),
    mutationKey: ['album', 'like'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['albums'],
      });
    },
  });
};

export const useDeleteLikeAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (albumId: number) => deleteLike(albumId),
    mutationKey: ['album', 'dislike'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['albums'],
      });
    },
  });
};

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation<IAlbum | null, Error, number | undefined>({
    mutationFn: deleteAlbum,
    mutationKey: ['album', 'delete'],
    onSuccess: (_deletedAlbum, albumId) => {
      if (!albumId) return;

      queryClient.setQueryData(['albums'], (oldData: IAlbum[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.filter((album) => album.id !== albumId);
      });

      queryClient.invalidateQueries({
        queryKey: ['albums'],
        exact: false,
      });
    },
  });
};
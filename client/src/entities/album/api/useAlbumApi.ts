import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addComment, addLike, create, deleteAlbum, deleteLike, getAll, getAllPopular, getComments, getLimitPopular, getOne, updateAlbum } from "./albumApi";
import { CreateAlbumDto, EditAlbumDto, IAlbum } from "../types/Album";
import { CreateCommentDto, IComment } from "@/entities/comment/types/Comment";

export const useGetAllAlbums = (sortBy: string) => {
  return useInfiniteQuery({
    queryKey: ['albums', sortBy],
    queryFn: ({ pageParam }) => getAll({ pageParam, sortBy }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length ? pages.length : undefined
    },
    initialPageParam: 0,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
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

export const useGetOneAlbum = (id: number) => {

  return useQuery({
    queryKey: ['albums', id],
    queryFn: () => getOne(id),
    placeholderData: (prev) => prev,
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
    mutationKey: ['albums', 'comment', 'create'],
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
    mutationFn: (id: number | undefined) => deleteAlbum(id),
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

export const useGetLimitPopularAlbums = () => {
  return useQuery({
    queryKey: ['albums', 'limit_popular'],
    queryFn: getLimitPopular,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });
};

export const useGetAllPopularAlbums = () => {
  return useQuery({
    queryKey: ['albums', 'all_popular'],
    queryFn: getAllPopular,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number | undefined; albumInfo: EditAlbumDto }) =>
      updateAlbum(params.id, params.albumInfo),
    mutationKey: ['album', 'update'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['albums'],
      });
    },
  })
}

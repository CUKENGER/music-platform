import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addLike,
  addListen,
  create,
  deleteLike,
  deleteTrack,
  getAll,
  getAllPopular,
  getFullAudio,
  getLimitPopular,
  getOne,
} from './trackApi';
import { CreateTrackDto, ITrack } from '../types/Track';
import { AxiosError } from 'axios';

export const useCreateTrack = () => {
  const queryClient = useQueryClient();

  return useMutation<ITrack, AxiosError, CreateTrackDto>({
    mutationFn: (trackInfo: CreateTrackDto) => create(trackInfo),
    mutationKey: ['track', 'create'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tracks'],
      });
    },
  });
};

export const useDeleteTrack = () => {
  const queryClient = useQueryClient();

  return useMutation<ITrack, AxiosError, number>({
    mutationFn: (trackId: number) => deleteTrack(trackId),
    mutationKey: ['track', 'delete'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tracks'],
      });
    },
  });
};

export const useDeleteLikeTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (trackId: number) => deleteLike(trackId),
    mutationKey: ['track', 'dislike'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tracks'],
      });
    },
  });
};

export const useAddLikeTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (trackId: number) => addLike(trackId),
    mutationKey: ['tracks', 'like'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tracks'],
      });
    },
  });
};

export const useAddListenTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (trackId: number) => addListen(trackId),
    mutationKey: ['tracksList', 'listen'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tracksList'],
      });
    },
  });
};

export const useGetAllTracks = (sortBy: string) => {
  return useInfiniteQuery({
    queryKey: ['tracksList', sortBy],
    queryFn: ({ pageParam }) => getAll({ pageParam, sortBy }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length ? pages.length : undefined;
    },
    initialPageParam: 0,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });
};

// placeholderData: (prev) => prev,
export const useGetOneTrack = (trackId: number) => {
  return useQuery({
    queryKey: ['track', trackId],
    queryFn: () => getOne(trackId),
  });
};

export const useGetFullAudio = (filename: string) => {
  return useQuery({
    queryKey: ['fullAudio', filename],
    queryFn: () => getFullAudio(filename),
    enabled: !!filename,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
};

export const useGetLimitPopularTracks = () => {
  return useQuery({
    queryKey: ['tracks', 'limit_popular'],
    queryFn: getLimitPopular,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });
};

export const useGetAllPopularTracks = () => {
  return useQuery({
    queryKey: ['tracks', 'all_popular'],
    queryFn: getAllPopular,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });
};

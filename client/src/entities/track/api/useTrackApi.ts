
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addLike, addListen, create, deleteLike, deleteTrack, getAll, getOne } from "./trackApi";
import { CreateTrackDto, ITrack } from "../types/Track";
import { AxiosError } from "axios";

export const useCreateTrack = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ITrack,
    AxiosError,
    CreateTrackDto
  >({
    mutationFn: (trackInfo: CreateTrackDto) => create(trackInfo),
    mutationKey: ['track', 'create'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tracks'],
      });
    },
  })
};

export const useDeleteTrack = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ITrack,
    AxiosError,
    number
  >({
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
    mutationKey: ['track', 'like'],
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
    mutationKey: ['track', 'listen'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tracks'],
      });
    },
  });
};

export const useGetAllTracks = (page = 0, count = 20) => {
  return useQuery({
    queryKey: ['tracks', page],
    queryFn: () => getAll( page, count ),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });
};

// placeholderData: (prev) => prev,


export const useGetOneTrack = (trackId: number) => {
  return useQuery({
    queryKey: ['track', trackId],
    queryFn: () => getOne(trackId),
  });
};




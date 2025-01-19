import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { create, getAll, getOne, getPopularTracks, search, deleteArtist, update } from "./artistApi";
import { CreateArtistDto } from "../types/Artist";

export const useGetAllArtists = (sortBy: string) => {
  return useInfiniteQuery({
    queryKey: ['artists', sortBy],
    queryFn: ({ pageParam }) => getAll({ pageParam, sortBy }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length ? pages.length : undefined
    },
    initialPageParam: 0,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });
};

export const useCreateArtist = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (artistInfo: CreateArtistDto) => create(artistInfo),
    mutationKey: ['artists', 'create'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['artists'],
      });
    },
  })
}

export const useGetOneArtist = (id: number) => {

  return useQuery({
    queryKey: ['artists', id],
    queryFn: () => getOne(id),
    placeholderData: (prev) => prev,
    // placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetArtistsPopularTracks = (id: number) => {

  return useQuery({
    queryKey: ['artists',  id, 'popular_tracks'],
    queryFn: () => getPopularTracks(id),
    // placeholderData: (prev) => prev,
    // placeholderData: keepPreviousData,
    // staleTime: 1000 * 60 * 5,
  });
};

export const useSearchArtists = (name: string) => {

  return useQuery({
    queryKey: ['artists', name],
    queryFn: () => search(name),
    enabled: !!name
  });
};

export const useDeleteArtist = (id: number) => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteArtist(id),
    mutationKey: ['artists', 'delete', id],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['artists'],
      });
    },
  })
}

export const useUpdateArtist = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (artistInfo: CreateArtistDto) => update(artistInfo, id),
    mutationKey: ['artists', 'update', id],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['artists'],
      });
    },
  })
}

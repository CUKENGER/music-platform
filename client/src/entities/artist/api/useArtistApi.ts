import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { create, getAll, getOne, search } from "./artistApi";
import { CreateArtistDto } from "../types/Artist";

export const useGetAllArtists = (count?: number, offset?: number) => {

  return useQuery({
    queryKey: ['artists', count, offset],
    queryFn: () => getAll(count, offset),
    placeholderData: (prev) => prev,
    // placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
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

export const useSearchArtists = (name: string) => {

  return useQuery({
    queryKey: ['artists', name],
    queryFn: () => search(name),
    // placeholderData: (prev) => prev,
    // placeholderData: keepPreviousData,
    // staleTime: 1000 * 60 * 5,
    enabled: !!name
  });
};

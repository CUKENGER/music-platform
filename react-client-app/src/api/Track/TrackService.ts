import { ITrack } from "@/types/track"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { apiUrl } from "../apiUrl";

// interface TrackSearchResult {
//     track_id?: number | undefined;
//     track_name: string;
//     artist_name: string;
//     track_genre: string;
//   }


export const tracksApi = createApi({
    reducerPath: 'tracksApi',
    baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
    tagTypes: ['Track'],
    endpoints: (builder) => ({
        getTracks: builder.query<ITrack[], { count: number; offset?: number }>({
            query: ({ count, offset}) => ({
                url: 'tracks',
                method: 'GET',
                params: {count, offset}
            }),
            providesTags: (result) => 
                result ? 
                result.map(({ id }) => ({ type: 'Track', id })) : 
                ['Track'],
        }),
        getOneTrack: builder.query<ITrack, number>({
            query: (id) => ({
                url: `tracks/${id}`,
                method: 'GET',
            }),
            providesTags: (result) => result ? [{ type: 'Track', id: result.id }] : ['Track'],
        }),
        createTrack : builder.mutation<ITrack, FormData>({
            query: (track) => ({
                url: 'tracks',
                method: 'POST',
                body: track
            }),
            invalidatesTags: ['Track']
        }),
        addListen : builder.mutation<void, number>({
            query: (id) => ({
                url: `tracks/listen/${id}`,
                method: 'POST'
            }),
            invalidatesTags: ['Track']
        }),
        deleteTrack : builder.mutation<void, number>({
            query: (id) => ({
                url: `tracks/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Track']
        }),
        searchByName : builder.query<ITrack[], {query: string, count: number, offset: number}>({
            query: ({query, count, offset = 0}) => ({
                url: `tracks/search?query=${query}&count=${count}&offset=${offset}`,
                method: 'GET'
            }),
            providesTags: (result) => 
                result ?
                result.map(({ id }) => ({ type: 'Track', id })) : 
                ['Track'],
        }),
        updateTrack : builder.mutation<ITrack, {id:number, data: FormData}>({
            query: ({id, data}) => ({
                url: `tracks/${id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Track']
        }),
        addLikeTrack : builder.mutation<void, number>({
            query: (id) => ({
                url: `tracks/like/${id}`,
                method: 'POST'
            }),
            invalidatesTags: ['Track']
        }),
        deleteLikeTrack : builder.mutation<void, number>({
            query: (id) => ({
                url: `tracks/unlike/${id}`,
                method: 'POST'
            }),
            invalidatesTags: ['Track']
        }),
        
    })
})

export const { useGetTracksQuery,
     useGetOneTrackQuery,
     useCreateTrackMutation,
     useAddListenMutation, 
     useDeleteTrackMutation ,
     useSearchByNameQuery,
     useUpdateTrackMutation,
     useAddLikeTrackMutation,
     useDeleteLikeTrackMutation,
} = tracksApi
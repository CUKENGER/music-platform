import { baseUrl } from "@/services/baseUrl";
import { ITrack } from "@/types/track"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const tracksApi = createApi({
    reducerPath: 'tracksApi',
    baseQuery: fetchBaseQuery({baseUrl: baseUrl}),
    tagTypes: ['Track'],
    endpoints: (builder) => ({
        getTracks: builder.query<ITrack[], { count?: number; offset?: number }>({
            query: ({ count = 10, offset = 0 }) => ({
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
            providesTags: (result) => ['Track'],
        }),
        createTrack : builder.mutation<ITrack, ITrack>({
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
            query: ({query, count = 30, offset = 0}) => ({
                url: `tracks/search?query=${query}&count=${count}&offset=${offset}`,
                method: 'GET'
            }),
            providesTags: (result) => 
                result ? 
                result.map(({ id }) => ({ type: 'Track', id })) : 
                ['Track'],
        })
    })
})

export const { useGetTracksQuery,
     useGetOneTrackQuery,
     useCreateTrackMutation, 
     useAddListenMutation, 
     useDeleteTrackMutation ,
     useSearchByNameQuery
} = tracksApi
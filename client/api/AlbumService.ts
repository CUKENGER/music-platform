import { baseUrl } from "@/services/baseUrl";
import { IAlbum, ITrack } from "@/types/track"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const albumsApi = createApi({
    reducerPath: 'albumsApi',
    baseQuery: fetchBaseQuery({baseUrl: baseUrl}),
    tagTypes: ['Album'],
    endpoints: (builder) => ({
        getAlbums: builder.query<IAlbum[], { count?: number; offset?: number }>({
            query: ({ count = 10, offset = 0 }) => ({
                url: 'albums',
                method: 'GET',
                params: {count, offset}
            }),
            providesTags: (result) => 
                result ? 
                result.map(({ id }) => ({ type: 'Album', id })) : 
                ['Album'],
        }),
        createAlbum : builder.mutation<IAlbum, FormData>({
            query: (formData) => ({
                url: 'albums',
                method: 'POST',
                body: formData
            }),
            invalidatesTags: ['Album']
        }),
        searchByNameAlbums : builder.query<IAlbum[], {query: string, count: number, offset: number}>({
            query: ({query, count = 30, offset = 0}) => ({
                url: `albums/search?query=${query}&count=${count}&offset=${offset}`,
                method: 'GET'
            }),
            providesTags: (result) => 
                result ? 
                result.map(({ id }) => ({ type: 'Album', id })) : 
                ['Album'],
        }),
        deleteAlbum : builder.mutation<void, number>({
            query: (id) => ({
                url: `albums/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Album']
        }),
    })
})

export const {
    useSearchByNameAlbumsQuery,
    useCreateAlbumMutation,
    useDeleteAlbumMutation
} = albumsApi
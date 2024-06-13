import { baseUrl } from "@/services/baseUrl";
import { IArtist} from "@/types/track"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const artistsApi = createApi({
    reducerPath: 'artistsApi',
    baseQuery: fetchBaseQuery({baseUrl: baseUrl}),
    tagTypes: ['Artist'],
    endpoints: (builder) => ({
        getArtists: builder.query<IArtist[], { count?: number; offset?: number }>({
            query: ({ count = 50, offset = 0 }) => ({
                url: 'artists',
                method: 'GET',
                params: {count, offset}
            }),
            providesTags: (result) => 
                result ? 
                result.map(({ id }) => ({ type: 'Artist', id })) : 
                ['Artist'],
        }),
        createArtist : builder.mutation<IArtist, FormData>({
            query: (formData) => ({
                url: 'artists',
                method: 'POST',
                body: formData
            }),
            invalidatesTags: ['Artist']
        }),
        searchByNameArtists : builder.query<IArtist[], {query: string, count: number, offset: number}>({
            query: ({query, count = 30, offset = 0}) => ({
                url: `artists/search?query=${query}&count=${count}&offset=${offset}`,
                method: 'GET'
            }),
            providesTags: (result) =>
                result ?
                result.map(({id}) => ({type: "Artist", id})) :
                ['Artist'],
        }),
        deleteArtist : builder.mutation<void, number>({
            query: (id) => ({
                url: `artists/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Artist']
        }),
        addLikeArtist : builder.mutation<void, number>({
            query: (id) => ({
                url: `artists/like/${id}`,
                method: 'POST'
            }),
            invalidatesTags: ['Artist']
        }),
        deleteLikeArtist : builder.mutation<void, number>({
            query: (id) => ({
                url: `artists/unlike/${id}`,
                method: 'POST'
            }),
            invalidatesTags: ['Artist']
        }),
        updateArtist : builder.mutation<IArtist, {id:number, data: FormData}>({
            query: ({id, data}) => ({
                url: `artists/${id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Artist']
        }),
    })
})

export const {
    useSearchByNameArtistsQuery,
    useCreateArtistMutation,
    useDeleteArtistMutation,
    useAddLikeArtistMutation,
    useDeleteLikeArtistMutation,
    useUpdateArtistMutation
} = artistsApi

import { baseUrl } from "@/services/baseUrl"
import { IComment, IReplyToComment } from "@/types/track"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const commentApi = createApi({
    reducerPath: 'commentApi',
    baseQuery: fetchBaseQuery({baseUrl: baseUrl}),
    tagTypes: ['Comment'],
    endpoints: (builder) => ({
        createComment: builder.mutation<IComment, IComment>({
            query: (comment) => ({
                url: 'tracks/comment',
                method: 'POST',
                body: comment
            }),
            invalidatesTags: ['Comment']
        }),
        createReplyToComment: builder.mutation<IReplyToComment, IReplyToComment>({
            query: (comment) => ({
                url: 'tracks/comment/replies',
                method: 'POST',
                body: comment
            }),
            invalidatesTags: ['Comment']
        }),
        addLikeComment: builder.mutation<void, number>({
            query: (id) => ({
                url: `tracks/comment/like/${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['Comment']
        }),
        deleteLikeComment: builder.mutation<void, number>({
            query: (id) => ({
                url: `tracks/comment/dislike/${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['Comment']
        })
       
    })
})

export const {
    useCreateCommentMutation,
    useCreateReplyToCommentMutation,
    useAddLikeCommentMutation,
    useDeleteLikeCommentMutation
} = commentApi
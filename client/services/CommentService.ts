
import { IComment} from "@/types/track"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseUrl } from "./baseUrl"


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
            })
        })
       
    })
})

export const {useCreateCommentMutation} = commentApi
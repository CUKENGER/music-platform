
import { IComment} from "@/types/track"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"


export const commentApi = createApi({
    reducerPath: 'commentApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:5000'}),
    tagTypes: ['Comment'],
    endpoints: (builder) => ({
        createComment: builder.mutation<IComment, IComment>({
            query: (comment) => ({
                url: '/tracks/comment',
                method: 'POST',
                body: comment
            })
        })
       
    })
})

export const {useCreateCommentMutation} = commentApi
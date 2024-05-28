import { FC, memo } from "react";
import styles from './CommentReplies.module.css'
import { IReplyToComment } from "@/types/track";

interface CommentRepliesProps{
    reply: IReplyToComment
}

const TrackCommentReplies:FC<CommentRepliesProps> = memo(({reply}) => {
    return (
        <div className={styles.container}>
            <div className={styles.name_container}>
                <p className={styles.username}>{reply.username}</p>
            </div>
            <div className={styles.line}></div>
            <div className={styles.text_container}>
                <p className={styles.text}>{reply.text}</p>
            </div>
        </div>
    )
})

export default TrackCommentReplies
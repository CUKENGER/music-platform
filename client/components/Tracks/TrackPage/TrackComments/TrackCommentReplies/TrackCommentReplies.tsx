import { FC, memo } from "react";
import styles from './TrackCommentReplies.module.css'
import { IReplyToComment } from "@/types/track";
import like from '@/assets/like.png'
import like_fill from '@/assets/like_fill.png'
import Image from "next/image";
import { useAddLikeReplyCommentMutation, useDeleteLikeReplyCommentMutation } from "@/api/Track/CommentService";
import { useAddLike } from "@/hooks/addLike";

interface CommentRepliesProps {
	reply: IReplyToComment
}

const TrackCommentReplies: FC<CommentRepliesProps> = memo(({ reply }) => {

	const [addLike] = useAddLikeReplyCommentMutation()
	const [deleteLike] = useDeleteLikeReplyCommentMutation()
	const initialLikes = reply.likes ? reply.likes : 0
	const { handleLike, isLike, likes } = useAddLike(addLike, deleteLike, initialLikes)

	const handleClickLike = (id: number) => {
		handleLike(id)
	}

	return (
		<div className={styles.container}>
			<div className={styles.username_container}>
				<div className={styles.name_container}>
					<p className={styles.username}>{reply.username}</p>
					<p className={styles.create_date}>23:44</p>
				</div>
				<div className={styles.line}></div>
			</div>
			<div className={styles.text_container}>
				<p className={styles.text}>{reply.text}</p>
			</div>
			<div
					className={styles.like_container}
					onClick={() => handleClickLike(reply.id)}
				>
					<Image
						className={styles.like}
						src={isLike ? like_fill : like}
						alt='like icon'
					/>
					<span className={styles.likes_count}>
						{likes}
					</span>
				</div>
		</div>
	)
})

export default TrackCommentReplies
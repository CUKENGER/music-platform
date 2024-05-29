import { FC, memo, useState } from "react";
import styles from './TrackCommentItem.module.css'
import { IComment } from "@/types/track";
import Image from "next/image";
import like from '@/assets/like.png'
import like_fill from '@/assets/like_fill.png'
import { useAddLikeCommentMutation, useDeleteLikeCommentMutation } from "@/api/Track/CommentService";
import { useAddLike } from "@/hooks/addLike";
import TrackReplyCommentInput from "../TrackReplyCommentInput/TrackReplyCommentInput";
import TrackCommentReplies from "../TrackCommentReplies/TrackCommentReplies";
import { useCreateComment } from "@/api/Track/createComment";

interface TrackCommentItemProps {
	comment: IComment
}

const TrackCommentItem: FC<TrackCommentItemProps> = memo(({ comment }) => {

	const {refetch} = useCreateComment();

	const [isReply, setIsReply] = useState(false)
	const [parentCommentId, setParentCommentId] = useState<number | null>(null)
	const [isLookReply, setIsLookReply] = useState(false)

	const [addLike] = useAddLikeCommentMutation()
	const [deleteLike, {}] = useDeleteLikeCommentMutation()
	const initialLikes = comment.likes ? comment.likes : 0
	const { handleLike, isLike, likes } = useAddLike(addLike, deleteLike, initialLikes)

	const handleReply = (commentId: number) => {
		setParentCommentId(commentId);
		setIsReply(!isReply);
	};

	const handleLookReplies = (id: number) => {
		setParentCommentId(id);
		setIsLookReply(!isLookReply)
	}

	const handleClickLike = (id: number) => {
		handleLike(id)
		refetch()
	}

	// console.log(comment.createDate);

	return (
		<div className={styles.comment}>
			<div className={styles.username_container}>
				<div className={styles.username_date_container}>
					<p className={styles.username}>{comment?.username}</p>
					<p className={styles.create_date}>23:44</p>	
				</div>
				<div className={styles.line}></div>
			</div>
			<p className={styles.comment_text}>{comment?.text}</p>
			<div className={styles.reply_btns_container}>
				<p
					className={styles.reply_btn}
					onClick={() => handleReply(comment.id)}
				>
					Ответить
				</p>
				{comment.replies &&
					comment.replies.length !== 0 && (
						<p
							className={styles.reply_btn}
							onClick={() => handleLookReplies(comment.id)}
						>
							Ответы {comment.replies.length}
						</p>
					)}
				<div
					className={styles.like_container}
					onClick={() => handleClickLike(comment.id)}
				>
					<Image
						className={styles.like}
						src={isLike ? like_fill : like}
						alt='like icon'
					/>
					<span className={styles.likes_count}>{likes}</span>
				</div>

			</div>

			{isReply &&
			parentCommentId === comment.id && (
					<TrackReplyCommentInput
						setIsReply={setIsReply}
						commentId={comment.id}
						refetch={refetch}
					/>
				)}

			{comment.replies &&
				!isReply &&
				isLookReply &&
				parentCommentId === comment.id &&
				comment.replies.map((reply) => (
					<TrackCommentReplies reply={reply} />
				))}
		</div>
	)
})

export default TrackCommentItem
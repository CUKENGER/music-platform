import React, { useState } from 'react';
import styles from './TrackComments.module.css';
import Textarea from '@/UI/Textarea/Textarea';
import ModalContainer from '@/UI/ModalContainer/ModalContainer';
import { ITrack } from '@/types/track';
import { FC, memo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCreateComment } from '@/api/Track/createComment';
import ReplyCommentInput from './TrackReplyCommentInput/TrackReplyCommentInput';
import CommentReplies from './TrackCommentReplies/TrackCommentReplies';
import Image from 'next/image'
import like from '@/assets/like.png'
import like_fill from '@/assets/like_fill.png'
import { useAddLike } from '@/hooks/addLike';
import { useAddLikeCommentMutation, useDeleteLikeCommentMutation } from '@/api/Track/CommentService';
import TrackCommentItem from './TrackCommentItem/TrackCommentItem';

interface TrackCommentsProps {
	openedTrack: ITrack | null;
}

const TrackComments: FC<TrackCommentsProps> = memo(({ openedTrack }) => {
	const router = useRouter();
	const {
		comment,
		comments,
		hideModal,
		isLoading,
		modal,
		sendComment,
		setComment
	} = useCreateComment();

	const [addLike] = useAddLikeCommentMutation()
	const [deleteLike] = useDeleteLikeCommentMutation()


	const [isReply, setIsReply] = useState(false)
	const [parentCommentId, setParentCommentId] = useState<number | null>(null)
	const [isLookReply, setIsLookReply] = useState(false)

	useEffect(() => {
		if (!openedTrack) {
			router.push('/tracks');
		}
	}, [openedTrack, router]);

	const handleSendComment = async () => {
		await sendComment();
		setParentCommentId(null); // Сбросить родительский комментарий после отправки
		setIsReply(false); // Закрыть поле для ответа после отправки
	};

	return (
		<div className={styles.container}>
			<div className={styles.add_comment_container}>

				<p className={styles.title_comment_container}>Комментарии</p>
				<div className={styles.comments_container}>
					{comments.map((comment) => (
						<TrackCommentItem 
							key={comment.id} 
							comment={comment}
						/>
					))}

				</div>

				{modal.isOpen && (
					<ModalContainer
						hideModal={hideModal}
						text={modal.message}
						onClick={modal.onClick}
					/>
				)}

			</div>
			<button
				onClick={handleSendComment}
				className={styles.btn}
				disabled={isLoading}
			>
				Отправить
			</button>
			<div className={styles.input_container}>
				<Textarea
					placeholder="Ваш комментарий"
					setValue={setComment}
					value={comment}
					onChangeNeed={true}
				/>
			</div>
		</div>
	);
});

export default TrackComments;

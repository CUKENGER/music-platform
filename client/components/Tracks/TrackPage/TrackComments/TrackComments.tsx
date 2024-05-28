import React, { useState } from 'react';
import styles from './Comments.module.css';
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
        setComment,
        refetch
    } = useCreateComment();

    const [addLike] = useAddLikeCommentMutation()
    const [deleteLike] = useDeleteLikeCommentMutation()

    const {handleLike, isLike,likes} = useAddLike(addLike, deleteLike)

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
    }

    return (
        <div className={styles.container}>
            <div className={styles.add_comment_container}>
                
            <p className={styles.title_comment_container}>Комментарии</p>
            <div className={styles.comments_container}>
                {comments.map((comment, index) => (
                    <div key={index} className={styles.comment}>
                        <div className={styles.username_container}>
                            <p className={styles.username}>{comment?.username}</p>
                            <div className={styles.line}></div>
                        </div>
                        <p className={styles.comment_text}>{comment?.text}</p>
                        <div className={styles.reply_btns_container}>
                            <p className={styles.reply_btn} onClick={() => handleReply(comment.id)}>
                                Ответить
                            </p>
                            {comment.replies && 
                            comment.replies.length !== 0 && (
                                <p className={styles.reply_btn} onClick={() => handleLookReplies(comment.id)}>
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
                                    <span>{comment.likes}</span>
                                </div>
                            
                        </div>
                        
                        {isReply && 
                        parentCommentId === comment.id && (
                            <ReplyCommentInput 
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
                            <CommentReplies reply={reply}/>
                        ))}
                    </div>
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

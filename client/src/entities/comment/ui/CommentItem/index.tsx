import { useCallback, useEffect, useState } from 'react';
import styles from './CommentItem.module.scss';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Btn, LikeIcon } from '@/shared/ui';
import { useGetByToken, useUserStore } from '@/entities/user';
import { useAddLikeComment, useDeleteLikeComment } from '../../api/useCommentApi';
import { IComment } from '../../types/Comment';
import { CommentText } from '../CommentText';
import { ReplyForm } from '../ReplyForm';
import { ReplyItem } from '../ReplyItem';

interface CommentItemProps {
  comment: IComment;
  refetchGetComments: () => void;
}

export const CommentItem = ({ comment, refetchGetComments }: CommentItemProps) => {
  const [isLike, setIsLike] = useState(false);
  const [localLikes, setLocalLikes] = useState<number>(comment.likes);
  const [isReplying, setIsReplying] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const { user, setUser } = useUserStore();

  const { mutate: addLike } = useAddLikeComment();
  const { mutate: deleteLike } = useDeleteLikeComment();
  const { refetch: refetchUser } = useGetByToken();

  useEffect(() => {
    if (user && comment.id) {
      const commentId = comment.id;
      if (user.likedComments) {
        setIsLike(user.likedComments.some((comment) => comment.id === commentId));
      }
    }
  }, [user, comment.id]);

  const handleLike = useCallback(() => {
    const updateUserData = () => {
      refetchUser()
        .then(({ data }) => {
          if (data) setUser(data);
        })
        .catch((error) => console.error('Error fetching updated user data:', error));
    };

    if (isLike) {
      deleteLike(comment.id, {
        onSuccess: () => {
          setIsLike(false);
          setLocalLikes((prevLikes) => prevLikes - 1);
          refetchGetComments();
          updateUserData();
        },
        onError: (error) => console.error('Error deleting like:', error),
      });
    } else {
      addLike(comment.id, {
        onSuccess: () => {
          setIsLike(true);
          setLocalLikes((prevLikes) => prevLikes + 1);
          refetchGetComments();
          updateUserData();
        },
        onError: (error) => console.error('Error adding like:', error),
      });
    }
  }, [comment.id, isLike, addLike, deleteLike, refetchGetComments, refetchUser]);

  const handleOpenReplyForm = () => {
    setIsReplying((prev) => !prev);
    setIsReplyOpen(false);
  };

  return (
    <div className={styles.comment}>
      <div className={styles.usernameInfo}>
        <p>{comment.username}</p>
        <p className={styles.createdAt}>
          {formatDistanceToNow(new Date(comment.createdAt), {
            addSuffix: true,
            locale: ru,
          })}
        </p>
      </div>
      <CommentText text={comment.text} />
      <div className={styles.commentFooter}>
        <LikeIcon isLike={isLike} onClick={handleLike} likes={localLikes} />
        <span onClick={() => setIsReplyOpen((prev) => !prev)} className={styles.repliesTitle}>
          Ответы {comment.replies.length}
        </span>
        <Btn small={true} className={styles.commentBtn} onClick={handleOpenReplyForm}>
          Ответить
        </Btn>
      </div>
      {isReplying && (
        <ReplyForm
          comment={comment}
          refetchGetComments={refetchGetComments}
          setIsReplying={setIsReplying}
          username={user?.username}
          setIsReplyOpen={setIsReplyOpen}
        />
      )}
      {isReplyOpen && (
        <div className={styles.replyList}>
          {comment.replies.map((reply) => (
            <ReplyItem key={reply.id} reply={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

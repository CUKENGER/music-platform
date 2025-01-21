import styles from './ReplyItem.module.scss'
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { IReply } from '../../types/Comment';
import { CommentText } from '../CommentText';

interface ReplyItemProps {
  reply: IReply
}

export const ReplyItem = ({reply}: ReplyItemProps) => {
  return (
    <div className={styles.reply}>
      <div className={styles.usernameInfo}>
        <p>{reply.username}</p>
        <p className={styles.createdAt}>
          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: ru })}
        </p>
      </div>
      <CommentText
         text={reply.text}
      />
    </div>
  )
}

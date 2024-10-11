import { FC } from 'react'
import styles from './ReplyItem.module.scss'
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CommentText } from '../CommentText/CommentText';
import { IReply } from '@/entities';

interface ReplyItemProps {
  reply: IReply
}

export const ReplyItem: FC<ReplyItemProps> = ({reply}) => {
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
import styles from './AlbumComments.module.scss'
import { FC, useMemo } from 'react'
import { CloseIcon, Loader, useSelectFilterStore } from '@/shared'
import { SelectFilter} from '@/features'
import { CommentItem, CommentSend, sortComments, useGetCommentsAlbum, useOpenCommentsStore } from '@/entities'
import { AnimatePresence, motion } from 'framer-motion';

interface AlbumCommentsProps {
  albumId: number | undefined
}

export const AlbumComments: FC<AlbumCommentsProps> = ({ albumId }) => {
  const { setIsOpen } = useOpenCommentsStore()
  const { selectedSort } = useSelectFilterStore()

  const { data: comments, isLoading, refetch } = useGetCommentsAlbum(albumId ?? 0)

  const sortedComments = useMemo(() => {
    if (comments) {
      if (comments.length > 0) {
        return sortComments(comments, selectedSort);
      }
      return comments;
    }
  }, [selectedSort, comments]);


  if (isLoading) {
    return <Loader />
  }

  return (
    <AnimatePresence>
      <motion.div
        className={styles.comments}
        initial={{ y: "100%", opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: "100%", opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div className={styles.commentsHeader}>
          <CloseIcon
            className={styles.closeIcon}
            onClick={() => setIsOpen(false)}
          />
          <SelectFilter
            className={styles.selectFilter}
            options={['Все', "По дате", "Популярные"]}
          />
        </div>
        <div className={styles.commentsList}>
          {comments && comments?.length < 1 && (
            <div className={styles.noComments}>
              Комментариев пока что нет, но вы можете оставить свой
            </div>
          )}
          {sortedComments && sortedComments.map((comment) => (
            <CommentItem
              refetchGetComments={refetch}
              key={comment.id}
              comment={comment}
            />
          ))}
        </div>
        <CommentSend
          albumId={albumId}
        />
      </motion.div>
    </AnimatePresence>
  )
}
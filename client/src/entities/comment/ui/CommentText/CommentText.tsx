import classNames from 'classnames'
import styles from './CommentText.module.scss'
import { FC, useEffect, useRef, useState } from 'react'

interface CommentTextProps{
  text: string
}

export const CommentText: FC<CommentTextProps> = ({text}) => {

  const [isExpanded, setIsExpanded] = useState(false)
  const [hasGradient, setHasGradient] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textRef.current) {
      const isLongDescription = textRef.current.scrollHeight > 120;
      setHasGradient(isLongDescription && !isExpanded);
    }
  }, [text, isExpanded]);

  return (
    <>
      <div
        className={classNames(
          styles.commentTextContainer,
          { [styles.expanded]: isExpanded },
          { [styles.hasGradient]: hasGradient }
        )}
        ref={textRef}
      >
        <p className={styles.commentText}>
          {text}
        </p>
      </div>
      {hasGradient && (
        <span
          className={styles.showMoreBtn}
          onClick={() => setIsExpanded(true)}
        >
          Показать еще
        </span>
      )}
      {isExpanded && (
        <span
          className={styles.showMoreBtn}
          onClick={() => setIsExpanded(false)}
        >
          Показать меньше
        </span>
      )}
    </>
  )
}
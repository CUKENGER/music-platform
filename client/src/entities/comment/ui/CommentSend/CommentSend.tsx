import { ModalContainer, Textarea, useInput, useModal } from '@/shared'
import styles from './CommentSend.module.scss'
import { FC, useState } from 'react'
import sendIconActive from '../assets/send_active.svg'
import sendIcon from '../assets/send.svg'
import { useCreateAlbumComment, useUserStore } from '@/entities'

interface CommentSendProps{
  albumId: number | undefined
}

export const CommentSend: FC<CommentSendProps> = ({albumId}) => {

  const [isSendHover, setIsSendHover] = useState(false)
  const { hideModal, modal, showModal } = useModal()
  const text = useInput('', {})
  
  const { user } = useUserStore()

  const { mutate: createComment } = useCreateAlbumComment()

  const handleSend = () => {

    if (text.value.trim() === '') {
      showModal('Заполните поле')
      return
    }

    const commentDto = {
      username: user?.username ?? 'Виталий',
      text: text.value.trim(),
      albumId: albumId ?? 0
    }

    createComment(commentDto, {
      onError: (e) => {
        showModal(`Произошла ошибка при отправке комментария ${e.message}`)
      },
      onSuccess: () => {
        showModal("Комментарий успешно отправлен");
        text.setValue('')
      }
    })
  }

  return (
    <div className={styles.commentAdd}>
        <Textarea
          classNameContainer={styles.textarea}
          inputValue={text}
          placeholder='Введите комментарий'
        />
        <div
          className={styles.commentSend}
          onMouseEnter={() => setIsSendHover(true)}
          onMouseLeave={() => setIsSendHover(false)}
          onClick={handleSend}
        >
          <img src={isSendHover ? sendIconActive : sendIcon} alt='send'/>
        </div>
        {modal.isOpen && (
          <ModalContainer
            hideModal={hideModal}
            text={modal.message}
          />
        )}
      </div>
  )
}
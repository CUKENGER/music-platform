import { Textarea, Btn, ModalContainer, useInput, useModal } from '@/shared'
import styles from './ReplyForm.module.scss'
import { FC, useCallback } from 'react';
import { IComment, useCreateAlbumComment } from '@/entities';

interface ReplyFormProps{
  comment: IComment;
  username: string | undefined;
  setIsReplying: (e: boolean) => void;
  refetchGetComments: () => void;
  setIsReplyOpen: (e: boolean) => void
} 

export const ReplyForm:FC<ReplyFormProps> = ({comment, username, setIsReplying, refetchGetComments, setIsReplyOpen}) => {

  const {modal, hideModal, showModal} = useModal()
  const reply = useInput('', {})
  const { mutate: addReply, isPending } = useCreateAlbumComment();

  const handleReplySubmit = useCallback(() => {
    if (!reply.value.trim()) {
      showModal('Введите текст');
      return;
    }

    addReply(
      { 
        parentId: comment.id, 
        text: reply.value.trim(), 
        username: username ?? '', 
        albumId: Number(comment.albumId) },
      {
        onSuccess: () => {
          reply.setValue('');
          setIsReplying(false);
          refetchGetComments();
          showModal('Ваш ответ успешно отправлен');
          setIsReplyOpen(true)
        },
        onError: (error) => {
          showModal('Произошла непредвиденная ошибка, повторите позже');
          console.error('Ошибка при добавлении ответа:', error);
        }
      }
    );
  }, [reply.value, comment.id, addReply, refetchGetComments]);

  return (
    <div className={styles.replyForm}>
      <Textarea
        style={{
          minHeight: "3lh"
        }}
        inputValue={reply}
        placeholder="Введите ваш ответ"
      />
      <Btn
        isLoading={isPending}
        small={true}
        onClick={handleReplySubmit}
      >
        Отправить
      </Btn>
      {modal.isOpen && (
        <ModalContainer
          hideModal={hideModal}
          text={modal.message}
        />
      )}
    </div>
  )
}
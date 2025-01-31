import { useInput, useModal } from '@/shared/hooks';
import { IComment } from '../../types/Comment';
import styles from './ReplyForm.module.scss';
import { useCallback } from 'react';
import { useCreateAlbumComment } from '@/entities/album';
import { Btn, ModalContainer, UITextAreaField } from '@/shared/ui';

interface ReplyFormProps {
  comment: IComment;
  username: string | undefined;
  setIsReplying: (e: boolean) => void;
  refetchGetComments: () => void;
  setIsReplyOpen: (e: boolean) => void;
}

export const ReplyForm = ({
  comment,
  username,
  setIsReplying,
  refetchGetComments,
  setIsReplyOpen,
}: ReplyFormProps) => {
  const { modal, hideModal, showModal } = useModal();
  const reply = useInput('', {});
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
        albumId: Number(comment.albumId),
      },
      {
        onSuccess: () => {
          reply.setValue('');
          setIsReplying(false);
          refetchGetComments();
          showModal('Ваш ответ успешно отправлен');
          setIsReplyOpen(true);
        },
        onError: (error) => {
          showModal('Произошла непредвиденная ошибка, повторите позже');
          console.error('Ошибка при добавлении ответа:', error);
        },
      },
    );
  }, [reply.value, comment.id, addReply, refetchGetComments]);

  return (
    <div className={styles.replyForm}>
      <UITextAreaField
        style={{
          minHeight: '3lh',
        }}
        value={reply.value}
        onChange={reply.onChange}
        placeholder="Введите ваш ответ"
      />
      <Btn isLoading={isPending} onClick={handleReplySubmit}>
        Отправить
      </Btn>
      <ModalContainer modal={modal} hideModal={hideModal} />
    </div>
  );
};

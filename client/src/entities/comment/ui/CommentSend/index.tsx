import styles from './CommentSend.module.scss';
import { useState } from 'react';
import sendIconActive from '../assets/send_active.svg';
import sendIcon from '../assets/send.svg';
import { useInput, useModal } from '@/shared/hooks';
import { useUserStore } from '@/entities/user';
import { useCreateAlbumComment } from '@/entities/album';
import { ModalContainer, UITextAreaField} from '@/shared/ui';

interface CommentSendProps {
  albumId: number | undefined;
}

export const CommentSend = ({ albumId }: CommentSendProps) => {
  const [isSendHover, setIsSendHover] = useState(false);
  const { hideModal, modal, showModal } = useModal();
  const text = useInput('', {});

  const { user } = useUserStore();

  const { mutate: createComment } = useCreateAlbumComment();

  const handleSend = () => {
    if (text.value.trim() === '') {
      showModal('Заполните поле');
      return;
    }

    const commentDto = {
      username: user?.username ?? 'Виталий',
      text: text.value.trim(),
      albumId: albumId ?? 0,
    };

    createComment(commentDto, {
      onError: (e) => {
        showModal(`Произошла ошибка при отправке комментария ${e.message}`);
      },
      onSuccess: () => {
        showModal('Комментарий успешно отправлен');
        text.setValue('');
      },
    });
  };

  return (
    <div className={styles.commentAdd}>
      <UITextAreaField
        classNameContainer={styles.textarea}
        value={text.value}
        onChange={text.onChange}
        placeholder="Введите комментарий"
      />
      <div
        className={styles.commentSend}
        onMouseEnter={() => setIsSendHover(true)}
        onMouseLeave={() => setIsSendHover(false)}
        onClick={handleSend}
      >
        <img src={isSendHover ? sendIconActive : sendIcon} alt="send" />
      </div>
      <ModalContainer modal={modal} hideModal={hideModal} />
    </div>
  );
};

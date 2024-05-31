import { useInput } from "@/hooks/useInput"
import useModal from "@/hooks/useModal"
import { useCreateReplyToCommentMutation } from "./CommentService"

export const useCreateReplyToComment = (commentId:number) => {
    const text = useInput('')
    const username = useInput('Ваника дурав')
    const { hideModal, modal, showModal } = useModal();

    const [createReply] = useCreateReplyToCommentMutation()

    const sendReply = async () => {
        if (text.value.trim() === '' && username.value.trim() === '') {
            showModal('Заполните поле перед отправкой');
            return;
        }

        try {
            await createReply({
                username: username.value.trim(),
                text: text.value.trim(),
                commentId: commentId,
                id: 0,
                likes: 0
            }).unwrap();

            console.log('ОТправлено');
        } catch(e) {
            showModal('Произошла неизвестная ошибка')
        }
    }

    return {
        showModal,
        modal,
        hideModal,
        sendReply,
        text,
        username
    }

}
import { FC, memo } from "react";
import styles from './TrackReplyCommentInput.module.css'
import Textarea from "@/UI/Textarea/Textarea";
import Btn from "@/UI/Btn/Btn";
import { useCreateReplyToComment } from "@/api/Track/createReplyToComment";
import ModalContainer from "@/UI/ModalContainer/ModalContainer";

interface TrackReplyCommentInputProps {
	commentId: number;
	setIsReply: (e: boolean) => void;
	refetch: () => void
}

const TrackReplyCommentInput: FC<TrackReplyCommentInputProps> = memo(({ commentId, setIsReply, refetch }) => {

	const {
		hideModal,
		modal,
		sendReply,
		showModal,
		text
	} = useCreateReplyToComment(commentId)

	const handleSend = () => {
		sendReply()
		setIsReply(false)
		refetch()
		showModal("Комментарий отправлен")
	}

	return (
		<div className={styles.reply_input_container}>
			<Textarea
				placeholder="Ваш ответ"
				setValue={text.setValue}
				value={text.value}
				onChangeNeed={true}
			/>
			<Btn onClick={handleSend}>
				Отправить
			</Btn>
			{modal.isOpen && (
				<ModalContainer
					hideModal={hideModal}
					text={modal.message}
					onClick={modal.onClick}
				/>
			)}
		</div>
	)
})

export default TrackReplyCommentInput
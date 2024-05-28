import { IComment } from "@/types/track";
import { useState, useEffect } from "react";
import { useGetOneTrackQuery } from "./TrackService";
import { useCreateCommentMutation } from "./CommentService";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import useModal from "@/hooks/useModal";

export const useCreateComment = () => {
    const { openedTrack } = useTypedSelector(state => state.playerReducer);
    const [comment, setComment] = useState<string>('');
    const [comments, setComments] = useState<IComment[]>(openedTrack?.comments ?? []);
    const { hideModal, modal, showModal } = useModal();

    const { data: track, error, isLoading, refetch } = useGetOneTrackQuery(openedTrack?.id as number);
    const [createCommentMutation, { isLoading: isCreating, isError, isSuccess, data: newComment }] = useCreateCommentMutation();
    
    useEffect(() => {
        if (track?.comments) {
            setComments(track.comments);
        }
    }, [track]);

    useEffect(() => {
        if (isSuccess && newComment) {
            setComments(prevComments => [...prevComments, newComment]);
            setComment('');
            showModal('Комментарий успешно создан', () => {
                hideModal()
            });
        }
    }, [isSuccess, newComment]);

    const sendComment = async () => {
        if (comment.trim() === '') {
            showModal('Заполните поле перед отправкой');
            return;
        }

        try {
            await createCommentMutation({
                trackId: openedTrack?.id,
                text: comment,
                username: 'Ванька Дурка',
                id: 0,
                replies: [],
                likes: 0
            });
            refetch()
        } catch (error) {
            showModal('Произошла ошибка при создании комментария');
        }
    };

    return {
        comment,
        setComment,
        comments,
        modal,
        sendComment,
        isLoading: isLoading || isCreating,
        error,
        showModal,
        hideModal,
        refetch
    };
};

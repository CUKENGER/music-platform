import styles from './CommentsMobile.module.css'
import Image from 'next/image'
import send_icon from '@/assets/send_icon.svg'
import krest_icon from '@/assets/comments_krest.svg'
import { FC, useEffect, useState } from 'react'
import { IComment, ITrack } from '@/types/track'
import { useTypedSelector } from '@/hooks/useTypedSelector'
import { useGetOneTrackQuery } from '@/api/TrackService'
import { useCreateCommentMutation } from '@/api/CommentService'
import Textarea from '@/UI/Textarea/Textarea'
import ModalContainer from '@/UI/ModalContainer/ModalContainer'

interface CommentsMobileProps {
    openedTrack: ITrack | null;
    handleOpenModal: ()=> void;
}

const CommentsMobile:FC<CommentsMobileProps> = ({openedTrack, handleOpenModal}) => {

    const [comment, setComment] = useState('')
    const [isErrorModal, setIsErrorModal] = useState(false)
    const [comments, setComments] = useState<IComment[]>([]); 
    const {activeTrack} = useTypedSelector(state=> state.playerReducer)

    const { data: track, error, isLoading } = useGetOneTrackQuery(openedTrack?.id as number);
    const [createCommentMutation, { isError }] = useCreateCommentMutation();

    const sendComment = async () => {
        try {
            if(comment.trim() !== '') {
                const newComment: IComment = {
                    trackId: openedTrack?.id,
                    username: 'Ванька Дурка',
                    text: comment,
                };
            
                await createCommentMutation({
                    trackId: openedTrack?.id,
                    text: comment,
                    username: 'Ванька Дурка',
                });
                if(track) {
                    setComments([...comments, 
                        ...track?.comments,
                        newComment,
                    ]);
                }
                setComment('');
                console.log('Comment sent');
            } else{
                setIsErrorModal(true)
            }
        } catch (error) {
            console.error('Error sending comment:', error);
        }
    }

    const handleSendComment = async () => {
        await sendComment()
    }

    useEffect(() => {
        if (track) {
            setComments([...track.comments]);
        }
    }, [track]);

    return (
        <div className={activeTrack ? styles.container : styles.notPlayerContainer}>
            <div className={styles.header_container}>
                
                    <div className={styles.header_text_container}>
                        <p className={styles.header_title}>    
                            Комментарии
                            <span className={styles.comments_count}>{openedTrack?.comments ? openedTrack?.comments.length : 45}</span>
                        </p>
                    </div>
                    <div className={styles.header_krest_container}>
                        <Image 
                            onClick={handleOpenModal}
                            src={krest_icon}
                            className={styles.krest_icon}
                            alt='close icon'
                        />
                    </div>
                
            </div>
            <div className={styles.main_container}>
                <div className={styles.comments_container}>
                    <div className={styles.comments_item}>
                        <div className={styles.header_comment}>
                            <p className={styles.username}>Ванька Дурка</p>
                            <div className={styles.line}></div>
                        </div>
                        <p className={styles.comment_text}>Люблю такие песни, забавные. Сразу хочется смеятся всем в лицо и заплевать своими слюнками. А потом тебя пиздят на мусорке и отбирают деньги</p>
                    </div>
                    {openedTrack && 
                    comments.map((comment: IComment, index) => (
                        <div key={index} className={styles.comments_item}>
                            <div className={styles.header_comment}>
                                <p className={styles.username}>Ванька Дурка</p>
                                <div className={styles.line}></div>
                            </div>
                        <p className={styles.comment_text}>{comment?.text}</p>
                        </div>
                    ))}
                </div>
                <div className={styles.send_container}>
                    <div className={styles.line}></div>
                    <div className={styles.input_container}>
                        <div className={styles.textarea_container}>
                            <Textarea 
                                value={comment} 
                                setValue={setComment} 
                                placeholder='Ваш комментарий'
                                onChangeNeed={true}
                            />
                        </div>
                        <div className={styles.send_icon_container}>
                            <Image 
                                onClick={handleSendComment}
                                className={styles.send_icon}
                                src={send_icon}
                                alt='send Icon'
                            />
                        </div>
                    </div>
                </div>
            </div>
            {isErrorModal && (
                <ModalContainer setState={setIsErrorModal} text='Напишите что-нибудь перед отправкой'/>
            )}
        </div>
    )
}

export default CommentsMobile
import styles from '@/styles/CommentsMobile.module.css'
import Image from 'next/image'
import send_icon from '@/assets/send_icon.svg'
import krest_icon from '@/assets/comments_krest.svg'
import Textarea from './Textarea'
import { FC, useEffect, useState } from 'react'
import { IComment, ITrack } from '@/types/track'
import { useCreateCommentMutation } from '@/services/CommentService'

interface CommentsMobileProps {
    openedTrack: ITrack | null;
    handleOpenModal: ()=> void;
}

const CommentsMobile:FC<CommentsMobileProps> = ({openedTrack, handleOpenModal}) => {

    const [comment, setComment] = useState('')
    const [comments, setComments] = useState<IComment[]>([]); 

    const [createCommentMutation, { isError }] = useCreateCommentMutation();

    const sendComment = async () => {
        try {
            if(comment !== '') {
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
                
                    setComments(prevComments => {
                        const updatedComments = [...prevComments, ...(openedTrack?.comments || []), newComment];
                        return updatedComments;
                    });
                    setComment('');
                    console.log('Comment sent');
            }
            
        } catch (error) {
            console.error('Error sending comment:', error);
        }
    }

    useEffect(()=>{
        setComments(prevComments => {
            const updatedComments = [...prevComments, ...(openedTrack?.comments || [])];
            return updatedComments;
        });
    }, [])

    return (
        <div className={styles.container}>
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
                            />
                        </div>
                        <div className={styles.send_icon_container}>
                            <Image 
                                onClick={sendComment}
                                className={styles.send_icon}
                                src={send_icon}
                                alt='send Icon'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentsMobile
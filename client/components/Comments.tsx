import styles from '@/styles/Comments.module.css'
import Input from './Input';
import { useState, FC, useEffect } from 'react';
import Textarea from './Textarea';
import { useCreateCommentMutation } from '@/services/CommentService';
import { IComment, ITrack } from '@/types/track';
import { useRouter } from 'next/router';


interface CommentsProps {
    openedTrack: ITrack | null;
}

const Comments:FC<CommentsProps> = ({openedTrack}) => {

    const [comment, setComment] = useState<string>('')
    const [commentSend, setCommentSend] = useState<IComment>({
        trackId: 0,
        username: 'Ванька Дурка',
        text: ''
    })

    const router = useRouter()

    useEffect(() =>{
        if (!openedTrack) {
            router.push('/tracks');
        }
        
    }, [openedTrack, router])

    const [createCommentMutation] = useCreateCommentMutation()

    const sendComment = async () => {
        try {
            const response = await createCommentMutation({
                trackId: openedTrack?.id, 
                text: comment,
                username: ''
            })
            setComment('')
            console.log('Comment send')
        } catch (e) {
            console.error(e)
        }
    }

    const handleSendComment = async () => {
        setCommentSend({ ...commentSend, text: comment })
        await sendComment()
    }

    return (
        <div className={styles.comments_container}>

            <div className={styles.add_comment_container}>
                <div className={styles.input_container}>
                    <Textarea
                    placeholder={"Ваш комментарий"} 
                    setValue={setComment} 
                    value={comment} 
                    />
                </div>
                <button
                onClick={handleSendComment} 
                className={styles.btn}
                >
                Отправить
                </button>
            </div>
            <p className={styles.title_comment_container}>Комментарии</p>
            <div className={styles.comment}>
                <div className={styles.username_container}>
                    <p className={styles.username}>Ванька Дурка</p>
                    <div className={styles.line}></div>
                </div>
                <p className={styles.comment_text}>Люблю такие песни, забавные. Сразу хочется смеятся всем в лицо и заплевать своими слюнками. А потом тебя пиздят на мусорке и отбирают деньгиЛюблю такие песни, забавные. Сразу хочется смеятся всем в лицо и заплевать своими слюнками. А потом тебя пиздят на мусорке и отбирают деньги</p>

            </div>
        {openedTrack &&
        openedTrack?.comments.map((comment) => (
            <div key={comment?.trackId} className={styles.comment}>
                <div className={styles.username_container}>
                    <p className={styles.username}>{comment?.username}</p>
                    <div className={styles.line}></div>
                </div>
                <p className={styles.comment_text}>{comment?.text}</p>

            </div>
        ))}
        </div>
            
           
      
    )
}

export default Comments;
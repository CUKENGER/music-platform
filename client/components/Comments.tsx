import styles from '@/styles/Comments.module.css'
import Input from './Input';
import { useState, FC, useEffect } from 'react';
import Textarea from './Textarea';
import { useCreateCommentMutation } from '@/services/CommentService';
import { IComment, ITrack } from '@/types/track';
import { useRouter } from 'next/router';
import { useGetOneTrackQuery } from '@/services/TrackService';
import Loader from './Loader';


interface CommentsProps {
    openedTrack: ITrack | null;
}

const Comments:FC<CommentsProps> = ({openedTrack}) => {

    const [comment, setComment] = useState<string>('')
    const [comments, setComments] = useState<IComment[]>([]); 

    const router = useRouter()

    useEffect(() =>{
        if (!openedTrack) {
            router.push('/tracks');
        }
    }, [openedTrack, router])

    const { data: track, error, isLoading } = useGetOneTrackQuery(openedTrack?.id as number);
    const [createCommentMutation, { isError }] = useCreateCommentMutation();

    const sendComment = async () => {
        try {
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
        
            setComments([...comments, 
                newComment
            ]);
            setComment('');
            console.log('Comment sent');
        } catch (error) {
            console.error('Error sending comment:', error);
        }
    }

    const handleSendComment = async () => {
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
            {isLoading && <Loader/>}
            {error && <p>Error: Error in get query</p>}
        {track &&
        comments.map((comment: IComment, index) => (
            <div key={index} className={styles.comment}>
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

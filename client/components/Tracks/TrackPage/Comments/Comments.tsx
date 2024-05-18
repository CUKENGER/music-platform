import styles from './Comments.module.css'
import { useState, FC, useEffect } from 'react';
import { IComment, ITrack } from '@/types/track';
import { useRouter } from 'next/router';
import { useGetOneTrackQuery } from '@/api/TrackService';
import { useCreateCommentMutation } from '@/api/CommentService';
import Textarea from '@/UI/Textarea/Textarea';
import Loader from '@/components/Loader/Loader';



interface CommentsProps {
    openedTrack: ITrack | null;
}

const Comments:FC<CommentsProps> = ({openedTrack}) => {

    const [comment, setComment] = useState<string>('')
    const [comments, setComments] = useState<IComment[]>(openedTrack?.comments ?? []); 

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
            if(track) {
                setComments([...comments, 
                    ...track?.comments,
                    newComment,
                ]);
            }
            setComment('');
            console.log('Comment sent');
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
            console.log(track.comments)
        }
    }, [track]);

    return (
        <div className={styles.comments_container}>

            <div className={styles.add_comment_container}>
                <div className={styles.input_container}>
                    <Textarea
                        placeholder={"Ваш комментарий"} 
                        setValue={setComment} 
                        value={comment} 
                        onChangeNeed={true}
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
        track.comments 
        ? (
            comments.map((comment: IComment, index) => (
                <div key={index} className={styles.comment}>
                    <div className={styles.username_container}>
                        <p className={styles.username}>{comment?.username}</p>
                        <div className={styles.line}></div>
                    </div>
                    <p className={styles.comment_text}>{comment?.text}</p>
    
                </div>
            ))
        ) 
        : (
            <Loader/>
        )}
        </div>
            
           
      
    )
}

export default Comments;

import { useState } from "react"


export const useAddLike = (
    addLike:(e:number) => void, 
    deleteLike:(e:number) => void,
    ) => {

    const [isLike, setIsLike] = useState(false)
    const [likes, setLikes] = useState(0)

    const handleLike = async (arg:any) => {
        try {
            if (isLike) {
                await deleteLike(arg);
                setLikes(prevLikes => prevLikes - 1);
            } else {
                await addLike(arg);
                setLikes(prevLikes => prevLikes + 1);
            }
            setIsLike(prevIsLike => !prevIsLike);
        } catch(e) {
            console.log('Error handling like:', e);
        }
    }

    return {
        likes,
        isLike,
        handleLike
    }

}
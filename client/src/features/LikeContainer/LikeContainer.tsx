import { FC, useEffect, useState, useCallback } from "react";
import { AxiosError } from "axios";
import { LikeIcon } from "@/shared";
import { IAlbum, IArtist, ITrack } from "@/entities";

interface LikeContainerProps {
  id: number;
  initialLikes: number;
  isLikedInitially: boolean;
  onAddLike: (id: number, onSuccess: () => void, onError: (error: AxiosError) => void) => void;
  onDeleteLike: (id: number, onSuccess: () => void, onError: (error: AxiosError) => void) => void;
  refetchEntity: (id: number) => Promise<{ data: ITrack | IAlbum | IArtist }>;
  updateEntityState: (entity: ITrack | IAlbum | IArtist) => void;
}

export const LikeContainer: FC<LikeContainerProps> = ({ 
  id, 
  initialLikes, 
  isLikedInitially, 
  onAddLike, 
  onDeleteLike, 
  refetchEntity, 
  updateEntityState 
}) => {
  const [isLike, setIsLike] = useState<boolean>(isLikedInitially);
  const [localLikes, setLocalLikes] = useState<number>(initialLikes);

  useEffect(() => {
    setLocalLikes(initialLikes);
    setIsLike(isLikedInitially);
  }, [initialLikes, isLikedInitially]);

  const handleLike = useCallback(() => {
    if (!id) return;

    const onSuccess = () => {
      setIsLike(!isLike);
      setLocalLikes(prevLikes => isLike ? prevLikes - 1 : prevLikes + 1);

      refetchEntity(id).then(({ data }) => {
        updateEntityState(data);
      }).catch((error: AxiosError) => {
        console.error('Error fetching updated entity:', error);
      });
    };

    const onError = (error: AxiosError) => {
      console.error('Error while updating like:', error);
    };

    if (isLike) {
      onDeleteLike(id, onSuccess, onError);
    } else {
      onAddLike(id, onSuccess, onError);
    }
  }, [id, isLike, onAddLike, onDeleteLike, refetchEntity, updateEntityState]);

  return (
    <LikeIcon 
      isLike={isLike}
      onClick={handleLike}
      likes={localLikes}
    />
  );
};

export interface IComment {
  id: number;
  username: string;
  text: string;
  likes: number;
  createdAt: string;
  replies: IReply[];
  albumId?: number;
}

export interface IReply {
  id: number;
  username: string;
  text: string;
  likes: number;
  createdAt: string;
}

export interface CreateCommentDto {
  username: string;
  text: string;
  albumId: number;
  parentId?: number;
}

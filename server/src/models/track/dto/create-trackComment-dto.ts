

export class CreateTrackCommentDto {
    readonly username: string;
    readonly text: string;
    readonly trackId: string;
    artistId?: string;
    parentId?: string;
    likes?: number;
}
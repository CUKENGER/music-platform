export class CreateTrackCommentDto {
  readonly username: string;
  readonly text: string;
  readonly trackId: number;
  artistId?: number;
  parentId?: number;
  likes?: number;
}

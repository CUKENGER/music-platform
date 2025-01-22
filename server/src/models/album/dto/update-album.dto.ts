export interface UpdateAlbumDto {
  name?: string;
  genre?: string;
  description?: string;
  releaseDate?: string;
  tracks?: UpdateAlbumTracksDto[];
  deletedTracks?: UpdateAlbumTracksDto[];
  artist?: string;
  track_names?: string[];
  track_texts?: string[];
}

export interface UpdateAlbumTracksDto {
  id: number | null;
  name: string;
  text: string;
  audio?: Express.Multer.File;
  isNew: string;
  isUpdated: string;
}

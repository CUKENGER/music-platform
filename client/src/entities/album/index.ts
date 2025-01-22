export type { IAlbum, CreateAlbumDto } from './types/Album';

export {
  useGetAllAlbums,
  useCreateAlbum,
  useGetOneAlbum,
  useAddLikeAlbum,
  useDeleteLikeAlbum,
  useGetCommentsAlbum,
  useCreateAlbumComment,
  useDeleteAlbum,
  useGetAllPopularAlbums,
  useGetLimitPopularAlbums,
  useUpdateAlbum,
} from './api/useAlbumApi';

export { AlbumItem } from './ui/AlbumItem';
export { AlbumInfo } from './ui/AlbumInfo';
export { MainInfoInputs } from './ui/MainInfoInputs';
export { AlbumCoverInput } from './ui/AlbumCoverInput';
export { TrackFormList } from './ui/TrackFormList';
export { MultipleInputAudio } from './ui/MultipleInputAudio';
export { EditTrackFormList } from './ui/EditTrackFormList';
export { AlbumCommonForm } from './ui/AlbumCommonForm';

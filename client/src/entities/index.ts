
export type { ITrack, TrackState, TrackUpdateState} from './track/types/Track'

export { default as usePlayerStore } from './track/model/PlayerStore'
export { default as useTrackTimeStore } from './track/model/TrackTimeStore'
export { default as useActiveTrackListStore} from './track/model/ActiveTrackListStore'
export {usePlayTrack} from './track/model/usePlayTrack'
export {mixTracks} from './track/model/mixTracks'
export {useTrackItem} from './track/model/useTrackItem'

export {
  useCreateTrack, 
  useAddLikeTrack, 
  useAddListenTrack,
  useDeleteLikeTrack,
  useDeleteTrack,
  useGetAllTracks,
  useGetOneTrack,
  useGetAudioChunks,
  useGetAllPopularTracks,
  useGetLimitPopularTracks,
} from './track/api/useTrackApi'

export {
  getLyrics
} from './track/api/trackApi'

export {NameContainer} from './track/ui/NameContainer/NameContainer'
export {TrackItem} from './track/ui/TrackItem/TrackItem'
export {TrackProgress} from './track/ui/TrackProgress/TrackProgress'
export {CurrentTimeContainer} from './track/ui/CurrentTimeContainer/CurrentTimeContainer'
export {VolumeBar} from './track/ui/VolumeBar/VolumeBar'
export {SwitchTrackBtns} from './track/ui/SwitchTrackBtns/SwitchTrackBtns'
export {PlayPauseBtn} from './track/ui/PlayPauseBtn/PlayPauseBtn'
export {MixIcon} from './track/ui/MixIcon/MixIcon'
export {CoverContainer} from './track/ui/CoverContainer/CoverContainer'
export {ChildrenTrack} from './track/ui/ChildrenTrack/ChildrenTrack'
export {TrackForm} from './track/ui/TrackForm/TrackForm'

export type {IAlbum, CreateAlbumDto} from './album/types/Album'

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
  useUpdateAlbum
} from './album/api/useAlbumApi'

export {AlbumItem} from './album/ui/AlbumItem/AlbumItem'
export {AlbumInfo} from './album/ui/AlbumInfo/AlbumInfo'
export {MainInfoInputs} from './album/ui/MainInfoInputs/MainInfoInputs'
export {AlbumCoverInput} from './album/ui/AlbumCoverInput/AlbumCoverInput'
export {TrackFormList} from './album/ui/TrackFormList/TrackFormList'
export {MultipleInputAudio} from './album/ui/MultipleInputAudio/MultipleInputAudio'
export {EditTrackFormList} from './album/ui/EditTrackFormList/EditTrackFormList'
export {AlbumCommonForm} from './album/ui/AlbumCommonForm/AlbumCommonForm'


export type {IArtist} from './artist/types/Artist'

export {ArtistItem} from './artist/ui/ArtistItem/ArtistItem'
export {SearchArtistInput} from './artist/ui/SearchArtistInput/SearchArtistInput'

export{
  useGetAllArtists,
  useCreateArtist,
  useGetOneArtist,
  useSearchArtists,
  useGetArtistsPopularTracks,
  useDeleteArtist,
  useUpdateArtist
} from './artist/api/useArtistApi'

export {useUserStore} from './user/model/userStore'
export {handleAuthError} from './user/model/handleAuthError'
export {useAuthInterceptor} from './user/model/useAuthInterceptor'

export {UserAvatar} from './user/ui/UserAvatar/UserAvatar'

export type {IComment, IReply} from './comment/types/Comment'

export {
  useAddLikeComment,
  useDeleteLikeComment
} from './comment/api/useCommentApi'

export {CommentItem} from './comment/ui/CommentItem/CommentItem'
export {CommentSend} from './comment/ui/CommentSend/CommentSend'

export {useOpenCommentsStore} from './comment/model/openCommentsStore'
export {sortComments} from './comment/model/sortComments'

export type { IUser }from './user/types/User'

export {
  useGetByToken,
  useSendEmail,
  useResetPassword
} from './user/api/useUserApi'

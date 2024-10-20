
export type { ITrack, TrackState} from './track/types/Track'

export { default as usePlayerStore } from './track/model/PlayerStore'
export { default as useTrackTimeStore } from './track/model/TrackTimeStore'
export { default as useActiveTrackListStore} from './track/model/ActiveTrackListStore'
export { default as usePlayTrack} from './track/model/usePlayTrack'
export { useAudio} from './track/model/useAudio'
export {useTrackList} from './track/model/useTrackList'
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
} from './track/api/useTrackApi'

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

export type {IAlbum} from './album/types/Album'

export {
  useGetAllAlbums,
  useCreateAlbum,
  useGetOneAlbum,
  useAddLikeAlbum,
  useDeleteLikeAlbum,
  useGetCommentsAlbum,
  useCreateAlbumComment
} from './album/api/useAlbumApi'

export {useAlbumList} from './album/model/useAlbumList'

export {AlbumItem} from './album/ui/AlbumItem/AlbumItem'
export {AlbumInfo} from './album/ui/AlbumInfo/AlbumInfo'


export type {IArtist} from './artist/types/Artist'

export {ArtistItem} from './artist/ui/ArtistItem/ArtistItem'
export {SearchArtistInput} from './artist/ui/SearchArtistInput/SearchArtistInput'

export{
  useGetAllArtists,
  useCreateArtist,
  useGetOneArtist,
  useSearchArtists,
  useGetArtistsPopularTracks
} from './artist/api/useArtistApi'

export {useArtistList} from './artist/model/useArtistList'
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

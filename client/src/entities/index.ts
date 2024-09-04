

export type { ITrack } from './track/types/Track'

export { default as usePlayerStore } from './track/model/PlayerStore'
export { default as useTrackTimeStore } from './track/model/TrackTimeStore'
export { default as useActiveTrackListStore} from './track/model/ActiveTrackListStore'

export {useUserStore} from './user/model/userStore'
export {handleAuthError} from './user/model/handleAuthError'
export {useAuthInterceptor} from './user/model/useAuthInterceptor'

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

export {UserAvatar} from './user/ui/UserAvatar/UserAvatar'

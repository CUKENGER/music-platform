import { TrackItem, useGetAllTracks } from "@/entities"
import { EntityList } from "@/widgets/EntityList/EntityList"
import styles from './Tracks.module.scss'
import { PrivateRoutes } from "@/shared"

export const Tracks = () => {
  return (
    <EntityList
      EntityItem={TrackItem}
      className={styles.TrackList}
      getAll={useGetAllTracks}
      toCreate={PrivateRoutes.CREATE_TRACK}
    />
  )
}
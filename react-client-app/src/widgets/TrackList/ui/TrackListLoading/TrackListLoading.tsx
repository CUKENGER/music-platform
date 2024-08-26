import { memo } from "react";
import styles from './TrackListLoading.module.scss'

const TrackListLoading = () => {
  return (
    <div className={styles.trackList_loading}>
      <div className={styles.track_item}></div>
      <div className={styles.track_item}></div>
      <div className={styles.track_item}></div>
      <div className={styles.track_item}></div>
      <div className={styles.track_item}></div>
      <div className={styles.track_item}></div>
      <div className={styles.track_item}></div>
      <div className={styles.track_item}></div>
      <div className={styles.track_item}></div>
      <div className={styles.track_item}></div>
      <div className={styles.track_item}></div>
      <div className={styles.track_item}></div>
      <div className={styles.track_item}></div>
      <div className={styles.track_item}></div>
      <div className={styles.track_item}></div>
      <div className={styles.track_item}></div>
    </div>
  );
};

export default memo(TrackListLoading);
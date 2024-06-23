import PageHeader from "@/components/PageHeader";
import { memo } from "react";
import styles from './Tracks.module.scss'
import TrackList from "@/components/TracksPage/TrackList";

const index = () => {
  return (
    <div className={styles.container}>
      <PageHeader/>
      <TrackList/>
    </div>
  );
};

export default memo(index);
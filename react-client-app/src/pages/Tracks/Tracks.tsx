import PageHeader from "@/widgets/PageHeader/PageHeader";
import TrackList from "@/widgets/TrackList/ui/TrackList/TrackList";
import styles from './Tracks.module.scss';

const Tracks = () => {
  return (
    <div className={styles.container}>
      <PageHeader/>
      <TrackList/>
    </div>
  );
};

export default Tracks;
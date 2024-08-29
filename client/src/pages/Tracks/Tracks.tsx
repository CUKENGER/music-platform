import { PrivateRoutes } from '@/shared';
import styles from './Tracks.module.scss'
import { PageHeader } from "@/widgets/PageHeader/ui/PageHeader";

export const Tracks = () => {


  return (
    <div className={styles.Tracks}>
      <PageHeader toCreate={PrivateRoutes.CREATE_TRACK}/>
    </div>
  );
}

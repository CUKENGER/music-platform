import { memo} from "react";
import styles from './CreateTrack.module.scss'
import { useNavigate } from "react-router-dom";
import CreateTrackForm from "./CreateTrackForm";

const CreateTrack = () => {

  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/tracks')
  }

  return (
    <div className={styles.container}>
      <div className={styles.btn_container}>
        <button onClick={handleBack}>
          Назад
        </button>
      </div>
      <CreateTrackForm/>
    </div>
  );
};

export default memo(CreateTrack);


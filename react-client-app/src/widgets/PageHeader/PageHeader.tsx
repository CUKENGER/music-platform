import { isAdmin } from "@/services/isAdmin";
import Btn from "@/shared/ui/Btn/Btn";
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DropDownMenu from "./components/DropdownMenu/DropDownMenu";
import styles from './PageHeader.module.scss';

const PageHeader = () => {

  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    navigate('/tracks/create')
  }, [navigate])

  return (
    <div className={styles.container}>
      <div className={styles.left_container}>
        <DropDownMenu />
      </div>
      <div className={styles.right_container}>
        {isAdmin && (
          <Btn onClick={handleClick}>
            Загрузить
          </Btn>
        )}

      </div>
    </div>
  );
};

export default memo(PageHeader);
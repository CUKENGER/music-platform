import { memo, useCallback } from "react";
import styles from './PageHeader.module.scss'
import DropDownMenu from "@/UI/DropdownMenu";
import { useNavigate } from "react-router-dom";
import Btn from "@/UI/Btn";
import { isAdmin } from "@/services/isAdmin";

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
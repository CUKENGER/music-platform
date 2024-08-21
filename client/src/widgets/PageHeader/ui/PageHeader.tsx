import { SelectFilter } from "@/features/SelectFilter/ui/SelectFilter"
import styles from './PageHeader.module.scss'
import { Btn } from "@/shared"

export const PageHeader = () => {
  return (
    <div className={styles.page_header}>
      <SelectFilter/>
      <Btn s={true}>
        Загрузить
      </Btn>
    </div>
  )
}
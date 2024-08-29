import { SelectFilter } from "@/features/SelectFilter/ui/SelectFilter"
import styles from './PageHeader.module.scss'
import { Btn } from "@/shared"
import { FC } from "react"
import { Link } from "react-router-dom"

interface PageHeaderProps {
  toCreate: string
}

export const PageHeader: FC<PageHeaderProps> = ({toCreate}) => {
  return (
    <div className={styles.page_header}>
      <SelectFilter/>
      <Link to={toCreate}>
        <Btn s={true}>
            Загрузить
        </Btn>
      </Link>
    </div>
  )
}
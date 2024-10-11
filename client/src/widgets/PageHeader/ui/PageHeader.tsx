import { SelectFilter } from "@/features/SelectFilter/ui/SelectFilter"
import styles from './PageHeader.module.scss'
import { Btn } from "@/shared"
import { FC, memo } from "react"
import { Link } from "react-router-dom"

interface PageHeaderProps {
  toCreate: string
}

export const PageHeader: FC<PageHeaderProps> = memo(({toCreate}) => {
  return (
    <div className={styles.page_header}>
      <SelectFilter options={['Все', 'Популярные', 'По алфавиту']}/>
      <Link to={toCreate}>
        <Btn small={true}>
            Загрузить
        </Btn>
      </Link>
    </div>
  )
})
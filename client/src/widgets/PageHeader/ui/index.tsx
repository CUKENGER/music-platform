import { Link } from 'react-router-dom';
import styles from './PageHeader.module.scss';
import { Btn } from '@/shared/ui';
import { SelectFilter } from '@/features/SelectFilter';

interface PageHeaderProps {
  toCreate: string;
}

export const PageHeader = ({ toCreate }: PageHeaderProps) => {
  return (
    <div className={styles.page_header}>
      <SelectFilter options={['Все', 'Популярные', 'По алфавиту']} />
      <Link to={toCreate}>
        <Btn>Загрузить</Btn>
      </Link>
    </div>
  );
};

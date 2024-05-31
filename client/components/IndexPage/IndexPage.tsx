import useModal from "@/hooks/useModal";
import MainLayout from "@/layouts/MainLayout";
import {FC, memo, useEffect } from "react";
import HeaderList from "../HeaderList/HeaderList";
import Loader from "../Loader/Loader";
import ModalContainer from "@/UI/ModalContainer/ModalContainer";
import styles from './IndexPage.module.css'

interface IndexPageProps<T>{
  title: string;
  placeholder: string;
  routerPath: string;
  data: T[] | undefined;
  error: any;
  isLoading: boolean;
  renderItem: FC<{ data: T[] }>;
}

function IndexPage<T>({
  title,
  placeholder,
  routerPath,
  data,
  error,
  isLoading,
  renderItem
} : IndexPageProps<T>){
  const {showModal, hideModal, modal} = useModal()

  useEffect(() => {
    if (error) {
      showModal(`Error loading data: ${error}`)
    }
  }, [error, showModal])

  return (
    <MainLayout title_text={title}>
      <div className={styles.container}>
        <HeaderList
          placeholder={placeholder}
          routerPath={routerPath}
        />
        {data && data.length > 0 ? (
          <>{renderItem({ data })}</> // Используется renderItem для отображения данных
        ) : (
          <div className={styles.not_found_container}>Ничего не найдено</div>
        )}
        {isLoading && <Loader />}
      </div>
      {modal.isOpen && (
        <ModalContainer
          hideModal={hideModal}
          text={modal.message}
          onClick={modal.onClick}
        />
      )}
    </MainLayout>
  )
}

export default memo(IndexPage) 
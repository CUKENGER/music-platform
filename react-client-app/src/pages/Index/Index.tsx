import { memo } from "react";
import styles from './Index.module.scss'
import SectionsList from "@/components/IndexPage/SectionsList";

const Index = () => {
  return (
    <>
      <SectionsList/>
    </>
  );
};

export default memo(Index);
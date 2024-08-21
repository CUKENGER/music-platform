import EntitySection from "@/widgets/EntitySection/ui/EntitySection";
import styles from './Home.module.scss'

export const Home = () => {
  return (
    <div className={styles.container}>
      <EntitySection/>
      <EntitySection/>
      <EntitySection/>
      <EntitySection/>
    </div>

  );
}

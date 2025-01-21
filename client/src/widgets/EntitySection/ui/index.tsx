import styles from './EntitySection.module.scss';
import { SectionArrow } from './assets/SectionArrow/SectionArrow';
import { Btn } from '@/shared/ui';
import { useEntitySection } from '../model/useEntitySection';

interface EntitySectionProps {
  title: string
}

export const EntitySection = ({ title }: EntitySectionProps) => {

  const {
    prevSlide,
    currentSlide,
    nextSlide,
    totalSlides,
    slidesPerPage,
    sliderRef
  } = useEntitySection()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p>{title}</p>
        <div className={styles.controls_container}>
          <Btn small={true}>Ещё</Btn>
          <div className={styles.controls_arrows}>
            <SectionArrow
              left={true}
              onClick={prevSlide}
              isDisabled={currentSlide === 0}
            />
            <SectionArrow
              onClick={nextSlide}
              isDisabled={currentSlide >= Math.ceil(totalSlides - slidesPerPage)}
            />
          </div>
        </div>
      </div>

      <div
        className={styles.slider}
        ref={sliderRef}
      >
        <div className={styles.slidesWrapper}>
          {[...Array(totalSlides)].map((_, index) => (
            <div className={styles.slide} key={index} style={{ minWidth: `${100 / slidesPerPage}%` }}>
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


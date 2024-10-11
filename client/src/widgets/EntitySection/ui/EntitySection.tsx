import React from 'react';
import styles from './EntitySection.module.scss';
import { SectionArrow } from './assets/SectionArrow/SectionArrow';
import { Btn } from '@/shared';
import { useEntitySection } from '../model/useEntitySection';

const EntitySection: React.FC = () => {
  
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
        <p>Title</p>
        <div>
          <Btn small={true}>Ещё</Btn>
          <div className={styles.controls_arrows}>
            <SectionArrow
              left={true}
              onClick={prevSlide}
              isDisabled={currentSlide === 0}
            />
            <SectionArrow
              onClick={nextSlide}
              isDisabled={currentSlide >= totalSlides - slidesPerPage}
            />
          </div>
        </div>
      </div>

      <div
        className={styles.slider}
        ref={sliderRef}
        style={{ overflowX: 'scroll', scrollSnapType: 'x mandatory' }}
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

export default EntitySection;

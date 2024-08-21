import React, { useRef, useState, useEffect } from 'react';
import styles from './EntitySection.module.scss';
import { SectionArrow } from './assets/SectionArrow/SectionArrow';
import { Btn } from '@/shared';

const EntitySection: React.FC = () => {
  const slidesPerPage = 3;
  const totalSlides = 14;
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    if (sliderRef.current) {
      const newScrollLeft = sliderRef.current.scrollLeft + sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const prevSlide = () => {
    if (sliderRef.current) {
      const newScrollLeft = sliderRef.current.scrollLeft - sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.offsetWidth / slidesPerPage;
      const newCurrentSlide = Math.round(sliderRef.current.scrollLeft / slideWidth);
      setCurrentSlide(newCurrentSlide);
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      const maxScrollLeft = sliderRef.current.scrollWidth - sliderRef.current.offsetWidth;
      setCurrentSlide(Math.round(sliderRef.current.scrollLeft / (sliderRef.current.offsetWidth / slidesPerPage)));

      sliderRef.current.addEventListener('scroll', handleScroll);
      return () => {
        sliderRef.current?.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p>Title</p>
        <div className={styles.controls}>
          <Btn s={true}>Ещё</Btn>
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

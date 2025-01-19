import { useEffect, useRef, useState } from "react";

export const useEntitySection = () => {
  const [slidesPerPage, setSlidesPerPage] = useState(3);
  const totalSlides = 14;
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);

  const updateSlidesPerPage = () => {
    const width = window.innerWidth;
    if (width < 768) setSlidesPerPage(1);
    else if (width < 1200) setSlidesPerPage(2);
    else setSlidesPerPage(3);
  };

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
    updateSlidesPerPage();

    window.addEventListener('resize', updateSlidesPerPage);
    return () => {
      window.removeEventListener('resize', updateSlidesPerPage);
    };
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.addEventListener('scroll', handleScroll);
      return () => {
        sliderRef.current?.removeEventListener('scroll', handleScroll);
      };
    }
  }, [slidesPerPage]);

  return {
    prevSlide,
    currentSlide,
    nextSlide,
    totalSlides,
    slidesPerPage,
    sliderRef
  };
};

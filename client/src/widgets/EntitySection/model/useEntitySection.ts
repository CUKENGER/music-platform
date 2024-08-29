import { useEffect, useRef, useState } from "react";

export const useEntitySection = () => {
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
      setCurrentSlide(Math.round(sliderRef.current.scrollLeft / (sliderRef.current.offsetWidth / slidesPerPage)));

      sliderRef.current.addEventListener('scroll', handleScroll);
      return () => {
        sliderRef.current?.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return {
    prevSlide,
    currentSlide,
    nextSlide,
    totalSlides,
    slidesPerPage,
    sliderRef
  }
}
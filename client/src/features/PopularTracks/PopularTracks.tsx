import { ReactNode, useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import { ITrack, TrackItem } from "@/entities";
import { useGetLimitPopularTracks } from "@/entities/track/api/useTrackApi";
import { Btn, Loader, useWindowWidth } from "@/shared";
import styles from './PopularTracks.module.scss';
import { SectionArrow } from "@/widgets/EntitySection/ui/assets/SectionArrow/SectionArrow";

const groupTracks = (tracks: ITrack[], groupSize: number) => {
  const groups = [];
  for (let i = 0; i < tracks.length; i += groupSize) {
    groups.push(tracks.slice(i, i + groupSize));
  }
  return groups;
};

export const PopularTracks = () => {
  const { data, error, isLoading } = useGetLimitPopularTracks();
  const groupedTracks = groupTracks(data ?? [], 4);
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);

  const windowWidth = useWindowWidth()

  useEffect(() => {
    if (sliderRef.current) {
      setIsFirstSlide(currentSlide === 0);
      if (windowWidth) {
        if (windowWidth <= 768) {
          setIsLastSlide(currentSlide === groupedTracks.length - 1);
        } else if (windowWidth <= 1160) {
          setIsLastSlide(currentSlide === groupedTracks.length - 2);
        } else {
          setIsLastSlide(currentSlide === groupedTracks.length - 3);
        }
      }
    }
  }, [currentSlide, groupedTracks.length, windowWidth]);

  const settings = {
    accessibility: true,
    dots: true,
    initialSlide: 1,
    swipe: true,
    swipeToSlide: true,
    draggable: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    appendDots: (dots: ReactNode) => (
      <div className={styles.dotsContainer}>
        <ul> {dots} </ul>
      </div>
    ),
    customPaging: (i: number) => (
      <div
        style={{
          backgroundColor: currentSlide === i ? 'white' : 'gray',
          opacity: currentSlide === i ? 1 : 0.5,
        }}
        className={styles.paging}
      />
    ),
    responsive: [
      {
        breakpoint: 1160,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (error) {
    console.log('error: \n', error);
    return <p>error get tracks {error.message}</p>;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <p className={styles.title}>Popular Tracks</p>
        <div className={styles.controls}>
          <SectionArrow isDisabled={isFirstSlide} onClick={() => sliderRef?.current?.slickPrev()} left={true} />
          <SectionArrow isDisabled={isLastSlide} onClick={() => sliderRef?.current?.slickNext()} />
          <Btn small={true}>
            Ещё
          </Btn>
        </div>
      </div>
      <Slider ref={sliderRef} {...settings}>
        {groupedTracks.map((group, index) => (
          <div key={index} className={styles.trackGroup}>
            {group.map((track) => (
              <TrackItem
                key={track.id}
                item={track}
                itemList={data ?? []}
                needClick={false}
                needDeleteIcon={false}
              />
            ))}
          </div>
        ))}
      </Slider>
    </div>
  );
};

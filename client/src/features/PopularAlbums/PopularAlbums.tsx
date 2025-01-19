import { useRef } from 'react';
import Slider from 'react-slick';
import { Btn, Loader, useWindowWidth } from "@/shared";
import styles from './PopularAlbums.module.scss';
import { AlbumItem, useGetLimitPopularAlbums } from '@/entities';
import { SectionArrow } from '@/widgets/EntitySection/ui/assets/SectionArrow/SectionArrow';

export const PopularAlbums = () => {
  const { data, error, isLoading } = useGetLimitPopularAlbums();
  const sliderRef = useRef<Slider>(null);

  // const windowWidth = useWindowWidth()

  const settings = {
    accessibility: true,
    dots: false,
    // initialSlide: 1,
    // centerMode: true,
    // centerPadding: '180px',
    draggable: true,
    swipe: true,
    swipeToSlide: true,
    // infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    arrows: false,
    // partialVisibility: true,
    responsive: [
      {
        breakpoint: 1680,
        settings: {
          slidesToShow: 7,
        }
      },
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 6,
        }
      },
      {
        breakpoint: 1310,
        settings: {
          slidesToShow: 5,
        }
      },
      {
        breakpoint: 1120,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 3,
          centerMode: true,
          centerPadding: '50px',
        }
      },
      {
        breakpoint: 765,
        settings: {
          slidesToShow: 3,
          centerMode: true,
          centerPadding: '30px',
        }
      },
      {
        breakpoint: 735,
        settings: {
          slidesToShow: 3,
          centerMode: true,
          centerPadding: '10px',
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: '60px',
        }
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: '30px',
        }
      },
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: '3%',
        }
      },
      {
        breakpoint: 345,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: '1%',
        }
      },
      {
        breakpoint: 335,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '20%',
        }
      },
    ]
  };

  if (error) {
    console.log('error: \n', error);
    return <p>error get albums {error.message}</p>;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <p className={styles.title}>Popular Albums</p>
        <div className={styles.controls}>
          <SectionArrow onClick={() => sliderRef?.current?.slickPrev()} left={true} />
          <SectionArrow onClick={() => sliderRef?.current?.slickNext()} />
          <Btn small={true}>
            Ещё
          </Btn>
        </div>
      </div>
      <Slider ref={sliderRef} {...settings}>
        {data?.map((album) => (
          <AlbumItem
            item={album}
            itemList={data}
            key={album.id}
          />
        ))}
      </Slider>
    </div>
  );
};

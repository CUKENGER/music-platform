import { useEffect, useState } from "react";

export default function useInfiniteScroll(callback: () => void) {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight &&
        !isFetching
      ) {
        setIsFetching(true);
        callback();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, callback]);

  return;
}
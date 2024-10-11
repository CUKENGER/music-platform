import { useEffect, useState } from "react";

export function useInfiniteScroll(callback: () => void) {
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

  useEffect(() => {
    if (!isFetching) return;
    callback();
    setIsFetching(false);
  }, [isFetching, callback]);

  return {isFetching}
}
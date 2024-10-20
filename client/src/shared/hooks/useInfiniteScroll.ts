import { useEffect, useState } from "react";

export function useInfiniteScroll(callback: () => Promise<void>) {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isBottom =
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight + 100;

      if (isBottom && !isFetching) {
        setIsFetching(true);
        callback().finally(() => setIsFetching(false));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, callback]);

  return { isFetching };
}

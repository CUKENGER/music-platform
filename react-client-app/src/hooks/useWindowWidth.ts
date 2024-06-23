import { useEffect, useState } from "react";
import useActions from "@/hooks/useActions";

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState<number | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setWindowWidth]);

  return windowWidth;
};

export default useWindowWidth;

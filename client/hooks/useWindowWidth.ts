// hooks/useWindowWidth.js
import { useEffect } from "react";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import useActions from "@/hooks/useActions";

const useWindowWidth = () => {
  const { windowWidth } = useTypedSelector(state => state.windowReducer);
  const { setWindowWidth } = useActions();

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

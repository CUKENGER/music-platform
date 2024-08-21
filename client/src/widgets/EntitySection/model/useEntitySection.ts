import { useRef, useState } from "react";

export const useEntitySection = () => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const itemWidth = 210;
  const items = Array.from({ length: 12 }, (_, index) => index);
  const visibleItems = Math.floor(listRef.current ? listRef.current.offsetWidth / itemWidth : 0);

  const handleLeftArrowClick = () => {
    setCurrentOffset((prev) => Math.max(prev - 6, 0));
  };

  const handleRightArrowClick = () => {
    const maxOffset = items.length - visibleItems;
    setCurrentOffset((prev) => Math.min(prev + 6, maxOffset));
  };

  const isLeftDisabled = currentOffset === 0;
  const isRightDisabled = currentOffset >= items.length - visibleItems;

  return {
    handleLeftArrowClick,
    handleRightArrowClick,
    listRef,
    items,
    currentOffset,
    visibleItems,
    isLeftDisabled,
    isRightDisabled
  }
}
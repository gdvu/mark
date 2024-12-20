import { useCallback, useEffect, useState, type RefObject } from 'react';

export const useHover = (ref: RefObject<HTMLElement | null>): boolean => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const onMouseEnter = useCallback(() => setIsHovered(true), []);
  const onMouseLeave = useCallback(() => setIsHovered(false), []);

  useEffect(() => {
    const node = ref.current;

    if (node) {
      node.addEventListener('mouseenter', onMouseEnter);
      node.addEventListener('mouseleave', onMouseLeave);

      return () => {
        node.removeEventListener('mouseenter', onMouseEnter);
        node.removeEventListener('mouseleave', onMouseLeave);
      };
    }

    return undefined;
  }, [ref, onMouseEnter, onMouseLeave]);

  return isHovered;
};

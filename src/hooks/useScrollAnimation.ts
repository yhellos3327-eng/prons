import { useRef } from 'react';
import { useInView } from 'framer-motion';

interface ScrollAnimationOptions {
  once?: boolean;
  delay?: number;
}

export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const { once = true, delay = 0 } = options;
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  const animationProps = {
    initial: { opacity: 0, y: 60 },
    animate: isInView
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 60 },
    transition: {
      duration: 0.6,
      delay,
    },
  };

  return { ref, isInView, animationProps };
};

export const useScrollFadeIn = (
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  options: ScrollAnimationOptions = {}
) => {
  const { once = true, delay = 0 } = options;
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: 60, x: 0 };
      case 'down':
        return { y: -60, x: 0 };
      case 'left':
        return { y: 0, x: 60 };
      case 'right':
        return { y: 0, x: -60 };
      default:
        return { y: 60, x: 0 };
    }
  };

  const initialPos = getInitialPosition();

  const animationProps = {
    initial: { opacity: 0, ...initialPos },
    animate: isInView
      ? { opacity: 1, y: 0, x: 0 }
      : { opacity: 0, ...initialPos },
    transition: {
      duration: 0.6,
      delay,
    },
  };

  return { ref, isInView, animationProps };
};

export const useStaggerAnimation = (
  _itemCount?: number,
  options: ScrollAnimationOptions = {}
) => {
  const { once = true, delay = 0 } = options;
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  const containerProps = {
    initial: 'hidden' as const,
    animate: isInView ? ('visible' as const) : ('hidden' as const),
    variants: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: delay,
        },
      },
    },
  };

  const itemProps = {
    variants: {
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
        },
      },
    },
  };

  return { ref, isInView, containerProps, itemProps };
};

export default useScrollAnimation;

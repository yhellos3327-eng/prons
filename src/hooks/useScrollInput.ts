import { useEffect } from 'react';

interface ScrollInputOptions {
    onNext: () => void;
    onPrev: () => void;
    onHome: () => void;
    onEnd: () => void;
    disabled?: boolean;
}

export const useScrollInput = ({ 
    onNext, 
    onPrev, 
    onHome, 
    onEnd, 
    disabled = false 
}: ScrollInputOptions) => {
    useEffect(() => {
        if (disabled) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (e.deltaY > 30) {
                onNext();
            } else if (e.deltaY < -30) {
                onPrev();
            }
        };

        let touchStartY = 0;
        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    onNext();
                } else {
                    onPrev();
                }
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                onNext();
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                onPrev();
            } else if (e.key === 'Home') {
                e.preventDefault();
                onHome();
            } else if (e.key === 'End') {
                e.preventDefault();
                onEnd();
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onNext, onPrev, onHome, onEnd, disabled]);
}

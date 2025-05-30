import { useState, useEffect } from 'react';

interface UseScrollVisibilityOptions {
    threshold?: number;
    showOnScrollUp?: boolean;
}

export const useScrollVisibility = (options: UseScrollVisibilityOptions = {}) => {
    const { threshold = 100, showOnScrollUp = false } = options;
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (showOnScrollUp) {
                // Show when scrolling up, hide when scrolling down
                if (currentScrollY > lastScrollY && currentScrollY > threshold) {
                    setIsVisible(false);
                } else if (currentScrollY < lastScrollY) {
                    setIsVisible(true);
                }
            } else {
                // Show when scrolled past threshold
                setIsVisible(currentScrollY > threshold);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, threshold, showOnScrollUp]);

    return isVisible;
};
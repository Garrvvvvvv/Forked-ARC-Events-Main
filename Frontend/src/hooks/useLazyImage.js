import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for lazy loading images using Intersection Observer
 * @param {Object} options - Intersection Observer options
 * @param {string} options.rootMargin - Margin around viewport for preloading (default: '50px')
 * @param {number} options.threshold - Visibility threshold 0-1 (default: 0.01)
 * @returns {Object} - { ref, isVisible } - Attach ref to element, isVisible indicates if element is in viewport
 */
export function useLazyImage(options = {}) {
    const {
        rootMargin = '200px',
        threshold = 0.01
    } = options;

    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        // If already visible, don't observe
        if (isVisible) return;

        // Create Intersection Observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        // Once visible, stop observing
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin,
                threshold
            }
        );

        observer.observe(element);

        // Cleanup
        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [isVisible, rootMargin, threshold]);

    return { ref: elementRef, isVisible };
}

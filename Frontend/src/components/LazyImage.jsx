import { useState } from 'react';
import { useLazyImage } from '../hooks/useLazyImage';

/**
 * Lazy-loading image component with blur-up placeholder
 * @param {Object} props - Component props
 * @param {string} props.src - Full resolution image URL
 * @param {string} props.placeholder - Low resolution placeholder URL (optional)
 * @param {string} props.alt - Alt text
 * @param {string} props.className - CSS classes
 * @param {Function} props.onLoad - Callback when image loads
 * @param {string} props.srcSet - Responsive image srcSet (optional)
 * @param {string} props.sizes - Responsive image sizes (optional)
 */
export default function LazyImage({
    src,
    placeholder,
    alt = '',
    className = '',
    onLoad,
    srcSet,
    sizes,
    ...rest
}) {
    const { ref, isVisible } = useLazyImage({ rootMargin: '200px' });
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleLoad = (e) => {
        setIsLoaded(true);
        if (onLoad) onLoad(e);
    };

    const handleError = () => {
        setHasError(true);
    };

    return (
        <div ref={ref} className={`relative ${className}`} {...rest}>
            {/* Placeholder - always visible if provided */}
            {placeholder && (
                <img
                    src={placeholder}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
                    style={{ filter: 'blur(20px)' }}
                />
            )}

            {/* Main image - only load when visible */}
            {isVisible && !hasError && (
                <img
                    src={src}
                    srcSet={srcSet}
                    sizes={sizes}
                    alt={alt}
                    className={`relative w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading="lazy"
                    decoding="async"
                />
            )}

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-500">
                    <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
}

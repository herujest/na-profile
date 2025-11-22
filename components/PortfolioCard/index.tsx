import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface PortfolioCardProps {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  images: string[];
  tags?: string[];
  categories?: string[];
  brands?: string[];
  onClick?: () => void;
}

// Loading Skeleton Component
const ImageSkeleton = () => (
  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse">
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        className="w-12 h-12 text-gray-400 dark:text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          stroke="currentColor"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  </div>
);

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  title,
  summary,
  images,
  categories = [],
  onClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>(
    {}
  );

  // Autoplay carousel with fade transition
  useEffect(() => {
    if (images.length <= 1) return;

    const startAutoplay = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 2500); // 2.5 second interval
    };

    // Pause autoplay when hovered or tab inactive
    if (!isHovered && document.visibilityState === "visible") {
      startAutoplay();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length, isHovered]);

  // Pause on tab visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      } else if (document.visibilityState === "visible" && !isHovered) {
        intervalRef.current = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 2500);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [images.length, isHovered]);

  if (!images || images.length === 0) return null;

  const getImageSrc = (src: string) => {
    // If it's already a full URL (http/https), use it directly
    if (src.startsWith("http://") || src.startsWith("https://")) {
      return src;
    }
    // If it's a relative path starting with /, use it directly
    if (src.startsWith("/")) {
      return src;
    }
    // Otherwise, treat it as a relative path and prepend /images/
    return `/images/${src}`;
  };

  const handleImageLoad = (index: number) => {
    setImageLoaded((prev) => ({ ...prev, [index]: true }));
  };

  const handleImageError = (index: number) => {
    // Still mark as loaded to hide skeleton even on error
    setImageLoaded((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <motion.div
      className="group cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="overflow-hidden rounded-lg">
        {/* Image Container with Autoplay Carousel */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: "500px", minHeight: "500px" }}
        >
          {images.map((imageSrc, index) => {
            const isActive = index === currentIndex;
            const finalSrc = getImageSrc(imageSrc);
            const isLoaded = imageLoaded[index] || false;
            const isExternal =
              finalSrc.startsWith("http://") || finalSrc.startsWith("https://");

            return (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Loading Skeleton - show when image is loading and is active */}
                {!isLoaded && isActive && <ImageSkeleton />}

                {/* Image */}
                {isExternal ? (
                  // Use Next.js Image with unoptimized for external URLs
                  <Image
                    src={finalSrc}
                    alt={`${title} - Image ${index + 1}`}
                    fill
                    className={`object-cover group-hover:scale-105 transition-all duration-700 ease-out ${
                      isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading={index === 0 || index === 1 ? "eager" : "lazy"}
                    unoptimized={true}
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                    quality={85}
                  />
                ) : (
                  // Use Next.js Image for local/relative paths
                  <Image
                    src={finalSrc}
                    alt={`${title} - Image ${index + 1}`}
                    fill
                    className={`object-cover group-hover:scale-105 transition-all duration-700 ease-out ${
                      isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index === 0 || index === 1}
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                    quality={85}
                  />
                )}
              </div>
            );
          })}

          {/* Overlay with title */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white text-xl font-light mb-2">{title}</h3>
              {summary && (
                <p className="text-white/90 text-sm font-light line-clamp-2">
                  {summary}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content below image */}
        <div className="mt-4">
          <h3 className="text-lg font-light mb-2 text-gray-900 dark:text-white">
            {title}
          </h3>
          {summary && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {summary}
            </p>
          )}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {categories.slice(0, 3).map((category, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                >
                  {category}
                </span>
              ))}
              {categories.length > 3 && (
                <span className="text-xs px-2 py-1 text-gray-500 dark:text-gray-400">
                  +{categories.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioCard;

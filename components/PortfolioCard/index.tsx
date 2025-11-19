import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface PortfolioCardProps {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  images: string[];
  techStack?: string[];
  contributions?: string[];
  features?: string[];
  onClick?: () => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  title,
  summary,
  images,
  techStack = [],
  onClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);

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
    return src.startsWith("/") ? src : `/images/${src}`;
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

            return (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={finalSrc}
                  alt={`${title} - Image ${index + 1}`}
                  layout="fill"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index === 0}
                />
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
          {techStack && techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {techStack.slice(0, 3).map((tech, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                >
                  {tech}
                </span>
              ))}
              {techStack.length > 3 && (
                <span className="text-xs px-2 py-1 text-gray-500 dark:text-gray-400">
                  +{techStack.length - 3}
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


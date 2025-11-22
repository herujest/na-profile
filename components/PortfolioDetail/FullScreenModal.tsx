"use client";

import { useEffect } from "react";
import Image from "next/image";

interface FullScreenModalProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  title: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onIndexChange: (index: number) => void;
  getImageSrc: (src: string) => string;
}

export default function FullScreenModal({
  isOpen,
  images,
  currentIndex,
  title,
  onClose,
  onNext,
  onPrev,
  onIndexChange,
  getImageSrc,
}: FullScreenModalProps) {
  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !images || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label="Close modal"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Image Container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((image, index) => {
          const modalImageSrc = getImageSrc(image);
          const isActive = index === currentIndex;

          return (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center">
                {modalImageSrc.startsWith("http://") ||
                modalImageSrc.startsWith("https://") ? (
                  <Image
                    src={modalImageSrc}
                    alt={`${title} - Fullscreen Image ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    unoptimized={true}
                    priority={isActive}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <Image
                    src={modalImageSrc}
                    alt={`${title} - Fullscreen Image ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority={isActive}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all backdrop-blur-sm"
              aria-label="Previous image"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all backdrop-blur-sm"
              aria-label="Next image"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white/10 text-white px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Image Info */}
        {images.length > 1 && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 text-white text-center">
            <h3 className="text-lg font-medium mb-1">{title}</h3>
            <p className="text-xs text-white/60">
              Image {currentIndex + 1} of {images.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


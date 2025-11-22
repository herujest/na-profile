"use client";

import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  currentIndex: number;
  title: string;
  onImageChange: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onImageClick: (index: number) => void;
  getImageSrc: (src: string) => string;
}

export default function ImageGallery({
  images,
  currentIndex,
  title,
  onImageChange,
  onNext,
  onPrev,
  onImageClick,
  getImageSrc,
}: ImageGalleryProps) {
  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const imageSrc = currentImage ? getImageSrc(currentImage) : null;

  return (
    <div className="mb-12">
      {/* Main Image */}
      <div
        className="relative w-full mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 cursor-pointer group"
        style={{ aspectRatio: "16/9", minHeight: "500px" }}
        onClick={() => onImageClick(currentIndex)}
      >
        {imageSrc && (
          <>
            {imageSrc.startsWith("http://") || imageSrc.startsWith("https://") ? (
              <Image
                src={imageSrc}
                alt={`${title} - Image ${currentIndex + 1}`}
                fill
                className="object-cover group-hover:opacity-90 transition-opacity"
                sizes="100vw"
                unoptimized={true}
                priority
              />
            ) : (
              <Image
                src={imageSrc}
                alt={`${title} - Image ${currentIndex + 1}`}
                fill
                className="object-cover group-hover:opacity-90 transition-opacity"
                sizes="100vw"
                priority
              />
            )}

            {/* Click indicator overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 dark:bg-black/90 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Click to view fullscreen
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10"
                  aria-label="Previous image"
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10"
                  aria-label="Next image"
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-2 tablet:grid-cols-4 laptop:grid-cols-6 gap-4">
          {images.map((image, index) => {
            const thumbSrc = getImageSrc(image);
            const isActive = index === currentIndex;
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  onImageChange(index);
                  onImageClick(index);
                }}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  isActive
                    ? "border-gray-900 dark:border-white ring-2 ring-gray-900 dark:ring-white"
                    : "border-transparent hover:border-gray-400 dark:hover:border-gray-600"
                }`}
              >
                {thumbSrc.startsWith("http://") || thumbSrc.startsWith("https://") ? (
                  <Image
                    src={thumbSrc}
                    alt={`${title} - Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    unoptimized={true}
                    loading="lazy"
                  />
                ) : (
                  <Image
                    src={thumbSrc}
                    alt={`${title} - Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    loading="lazy"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


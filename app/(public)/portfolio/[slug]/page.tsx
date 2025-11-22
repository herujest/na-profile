"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Text, Button } from "@/components/atoms";

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  images: string[];
  tags?: string[];
  categories?: string[];
  brands?: string[];
  featured?: boolean;
}

export default function PortfolioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [portfolioItem, setPortfolioItem] = useState<PortfolioItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPortfolioItem = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const res = await fetch(`/api/portfolio/${slug}`);

        if (res.status === 404) {
          setError("Portfolio not found");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch portfolio");
        }

        const data = await res.json();
        console.log("[Portfolio Detail] Fetched data:", data);
        setPortfolioItem(data);
      } catch (err: any) {
        console.error("Failed to fetch portfolio:", err);
        setError(err.message || "Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItem();
  }, [slug]);

  const getImageSrc = (src: string) => {
    if (src.startsWith("http://") || src.startsWith("https://")) {
      return src;
    }
    if (src.startsWith("/")) {
      return src;
    }
    return `/images/${src}`;
  };

  const handleNextImage = () => {
    if (portfolioItem && portfolioItem.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % portfolioItem.images.length);
    }
  };

  const handlePrevImage = () => {
    if (portfolioItem && portfolioItem.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? portfolioItem.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading portfolio...
          </p>
        </div>
      </div>
    );
  }

  if (error || !portfolioItem) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || "Portfolio Not Found"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The portfolio item you're looking for doesn't exist or has been
            removed.
          </p>
          <Button href="/portfolio" variant="primary" size="md">
            Back to Portfolio
          </Button>
        </div>
      </div>
    );
  }

  const currentImage = portfolioItem.images[currentImageIndex];
  const imageSrc = currentImage ? getImageSrc(currentImage) : null;

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
      <div className="container mx-auto px-4 laptop:px-0">
        <div className="py-8 laptop:py-12">
          {/* Back Button */}
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Portfolio
          </Link>

          {/* Portfolio Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Title */}
            <div className="mb-12">
              <Text variant="h1" className="mb-8">
                {portfolioItem.title}
              </Text>
            </div>

            {/* Image Gallery */}
            {portfolioItem.images && portfolioItem.images.length > 0 && (
              <div className="mb-12">
                {/* Main Image */}
                <div
                  className="relative w-full mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900"
                  style={{ aspectRatio: "16/9", minHeight: "500px" }}
                >
                  {imageSrc && (
                    <>
                      {imageSrc.startsWith("http://") ||
                      imageSrc.startsWith("https://") ? (
                        <Image
                          src={imageSrc}
                          alt={`${portfolioItem.title} - Image ${
                            currentImageIndex + 1
                          }`}
                          fill
                          className="object-cover"
                          sizes="100vw"
                          unoptimized={true}
                          priority
                        />
                      ) : (
                        <Image
                          src={imageSrc}
                          alt={`${portfolioItem.title} - Image ${
                            currentImageIndex + 1
                          }`}
                          fill
                          className="object-cover"
                          sizes="100vw"
                          priority
                        />
                      )}

                      {/* Navigation Arrows */}
                      {portfolioItem.images.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
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
                            onClick={handleNextImage}
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
                            {currentImageIndex + 1} /{" "}
                            {portfolioItem.images.length}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {portfolioItem.images.length > 1 && (
                  <div className="grid grid-cols-2 tablet:grid-cols-4 laptop:grid-cols-6 gap-4">
                    {portfolioItem.images.map((image, index) => {
                      const thumbSrc = getImageSrc(image);
                      const isActive = index === currentImageIndex;
                      return (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            isActive
                              ? "border-gray-900 dark:border-white ring-2 ring-gray-900 dark:ring-white"
                              : "border-transparent hover:border-gray-400 dark:hover:border-gray-600"
                          }`}
                        >
                          {thumbSrc.startsWith("http://") ||
                          thumbSrc.startsWith("https://") ? (
                            <Image
                              src={thumbSrc}
                              alt={`${portfolioItem.title} - Thumbnail ${
                                index + 1
                              }`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                              unoptimized={true}
                              loading="lazy"
                            />
                          ) : (
                            <Image
                              src={thumbSrc}
                              alt={`${portfolioItem.title} - Thumbnail ${
                                index + 1
                              }`}
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
            )}

            {/* Metadata */}
            <div className="space-y-8 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              {/* Summary Section - Prominent */}
              {portfolioItem.summary && (
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                    About This Project
                  </h3>
                  <div className="max-w-4xl">
                    <p className="text-base laptop:text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {portfolioItem.summary}
                    </p>
                  </div>
                </div>
              )}

              {/* Categories */}
              {portfolioItem.categories &&
                portfolioItem.categories.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {portfolioItem.categories.map((category, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Tags */}
              {portfolioItem.tags && portfolioItem.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolioItem.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              {portfolioItem.brands && portfolioItem.brands.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                    Brands
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolioItem.brands.map((brand, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

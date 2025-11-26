"use client";

export const dynamic = 'error';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Text } from "@/components/atoms";
import {
  ImageGallery,
  FullScreenModal,
  PortfolioMetadata,
  BackButton,
  LoadingState,
  ErrorState,
} from "@/components/PortfolioDetail";
import type { PortfolioItem } from "@/components/PortfolioDetail/types";
import { getImageSrc } from "@/components/PortfolioDetail/utils";

export default function PortfolioDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [portfolioItem, setPortfolioItem] = useState<PortfolioItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

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

  // Handlers
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

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleOpenModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalNext = () => {
    if (portfolioItem && portfolioItem.images.length > 0) {
      setModalImageIndex((prev) => (prev + 1) % portfolioItem.images.length);
    }
  };

  const handleModalPrev = () => {
    if (portfolioItem && portfolioItem.images.length > 0) {
      setModalImageIndex((prev) =>
        prev === 0 ? portfolioItem.images.length - 1 : prev - 1
      );
    }
  };

  const handleModalIndexChange = (index: number) => {
    setModalImageIndex(index);
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error || !portfolioItem) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
      <div className="container mx-auto px-4 laptop:px-0">
        <div className="py-8 laptop:py-12">
          <BackButton href="/portfolio" />

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
              <ImageGallery
                images={portfolioItem.images}
                currentIndex={currentImageIndex}
                title={portfolioItem.title}
                onImageChange={handleImageChange}
                onNext={handleNextImage}
                onPrev={handlePrevImage}
                onImageClick={handleOpenModal}
                getImageSrc={getImageSrc}
              />
            )}

            {/* Metadata */}
            <PortfolioMetadata
              summary={portfolioItem.summary}
              categories={portfolioItem.categories}
              tags={portfolioItem.tags}
              brands={portfolioItem.brands}
            />
          </motion.div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      <FullScreenModal
        isOpen={isModalOpen}
        images={portfolioItem.images}
        currentIndex={modalImageIndex}
        title={portfolioItem.title}
        onClose={handleCloseModal}
        onNext={handleModalNext}
        onPrev={handleModalPrev}
        onIndexChange={handleModalIndexChange}
        getImageSrc={getImageSrc}
      />
    </div>
  );
}

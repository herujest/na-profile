"use client";

export const dynamic = "error";

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
import PartnerCard from "@/components/PortfolioDetail/PartnerCard";
import RelatedPortfolioCard from "@/components/PortfolioDetail/RelatedPortfolioCard";
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
  const [relatedPortfolios, setRelatedPortfolios] = useState<PortfolioItem[]>(
    []
  );
  const [loadingRelated, setLoadingRelated] = useState(false);

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

        // Fetch related portfolios from the same partner
        if (data.partner?.id) {
          fetchRelatedPortfolios(data.partner.id, data.slug);
        }
      } catch (err: any) {
        console.error("Failed to fetch portfolio:", err);
        setError(err.message || "Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItem();
  }, [slug]);

  const fetchRelatedPortfolios = async (
    partnerId: string,
    excludeSlug: string
  ) => {
    try {
      setLoadingRelated(true);
      // Fetch all portfolios and filter by partnerId, exclude current portfolio
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        const allPortfolios = data.portfolioItems || [];

        // Filter portfolios by partnerId and exclude current portfolio
        const related = allPortfolios.filter(
          (portfolio: PortfolioItem) =>
            portfolio.partner?.id === partnerId &&
            portfolio.slug !== excludeSlug
        );

        // Limit to 6 portfolios and sort by datePublished or createdAt
        const sorted = related
          .sort((a: PortfolioItem, b: PortfolioItem) => {
            const dateA = a.datePublished || a.createdAt || "";
            const dateB = b.datePublished || b.createdAt || "";
            return dateB.localeCompare(dateA);
          })
          .slice(0, 6);

        setRelatedPortfolios(sorted);
      }
    } catch (err) {
      console.error("Failed to fetch related portfolios:", err);
    } finally {
      setLoadingRelated(false);
    }
  };

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

            {/* Partner Card */}
            {portfolioItem.partner && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6 uppercase tracking-wide">
                  Collaboration Partner
                </h3>
                <PartnerCard partner={portfolioItem.partner} />
              </div>
            )}

            {/* Related Portfolios Section */}
            {relatedPortfolios.length > 0 && (
              <div className="mt-12 pt-8 pb-8 border-b px-8  border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    More with {portfolioItem.partner?.name || "this partner"}
                  </h3>
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    {relatedPortfolios.length}
                  </span>
                </div>
                {loadingRelated ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white mb-2"></div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Loading...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-4xl">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                      {relatedPortfolios.map((portfolio) => (
                        <RelatedPortfolioCard
                          key={portfolio.id}
                          portfolio={portfolio}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
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

"use client";

import { useEffect, useState, RefObject } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PortfolioCard from "@/components/PortfolioCard";

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

interface PortfolioProps {
  workRef?: RefObject<HTMLDivElement>;
  collabs?: any[];
  featured?: boolean;
  limit?: number;
}

// Helper function to convert collaborations to portfolio items
const convertCollabsToPortfolioItems = (collabs: any[]): PortfolioItem[] => {
  return collabs.map((collab) => ({
    id: collab.id || `collab-${Math.random()}`,
    title: collab.title || "",
    slug: collab.slug || collab.id || `collab-${Math.random()}`,
    summary: collab.summary || collab.description || "",
    images:
      collab.images ||
      collab.media?.map((m: any) =>
        typeof m.imageSrc === "string" ? m.imageSrc : m.imageSrc[0]
      ) ||
      [],
    tags: collab.tags || [],
    categories: collab.categories || [],
    brands: collab.brands || [],
  }));
};

export default function Portfolio({
  workRef,
  collabs,
  featured,
  limit,
}: PortfolioProps) {
  const router = useRouter();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // Fetch featured items if featured prop is true, otherwise fetch all
        const url = featured
          ? "/api/portfolio?featured=true"
          : collabs && collabs.length > 0
          ? "/api/portfolio"
          : "/api/portfolio";

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          let items = data.portfolioItems || [];

          // If featured prop is true, filter to only featured items
          if (featured) {
            items = items.filter(
              (item: PortfolioItem) => item.featured === true
            );
          }

          // Add collaborations if provided
          if (collabs && collabs.length > 0) {
            const collabItems = convertCollabsToPortfolioItems(collabs);
            items = [...items, ...collabItems];
          }

          // Apply limit if specified
          if (limit && limit > 0) {
            items = items.slice(0, limit);
          }

          setPortfolioItems(items);
        }
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [featured, collabs, limit]);

  const handleCardClick = (slug: string) => {
    router.push(`/portfolio/${slug}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading portfolio...
          </p>
        </div>
      </div>
    );
  }

  if (portfolioItems.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No portfolio items available
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 mob:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 justify-between gap-10">
      {portfolioItems.map((item) => (
        <PortfolioCard
          key={item.id}
          id={item.id}
          title={item.title}
          slug={item.slug}
          summary={item.summary}
          images={item.images}
          tags={item.tags}
          categories={item.categories}
          brands={item.brands}
          onClick={() => handleCardClick(item.slug)}
        />
      ))}
    </div>
  );
}

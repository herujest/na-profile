import { useEffect, useState, RefObject } from "react";
import Link from "next/link";
import PortfolioCard from "../../../components/PortfolioCard";

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  images: string[];
  techStack?: string[];
  contributions?: string[];
  features?: string[];
}

interface PortfolioProps {
  workRef?: RefObject<HTMLDivElement>;
  collabs?: any[];
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
    techStack: collab.techStack || [],
    contributions: collab.contributions || [],
    features: collab.features || [],
  }));
};

export default function Portfolio({ workRef, collabs }: PortfolioProps) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const data = await res.json();
          setPortfolioItems(data.items || []);
        } else if (collabs && collabs.length > 0) {
          // Fallback to collabs if API fails
          setPortfolioItems(convertCollabsToPortfolioItems(collabs));
        }
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
        // Fallback to collabs on error
        if (collabs && collabs.length > 0) {
          setPortfolioItems(convertCollabsToPortfolioItems(collabs));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [collabs]);

  const handleCardClick = (slug: string) => {
    // Navigate to portfolio detail page or show modal
    window.location.href = `/portfolio/${slug}`;
  };

  if (loading) {
    return (
      <div className="mt-10 laptop:mt-30 p-2 laptop:p-0" ref={workRef}>
        <div className="py-20 text-center">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div
      className="w-full px-4 laptop:px-0"
      ref={workRef}
      style={{ paddingBlock: "50px" }}
    >
      {/* Section Heading */}
      <div className="flex flex-col laptop:flex-row laptop:items-center laptop:justify-between mb-16 laptop:mb-24">
        <h1 className="text-4xl laptop:text-6xl laptopl:text-7xl font-light leading-tight">
          Stories through light & lens
        </h1>
        <Link
          href="/portfolio"
          className="text-lg laptop:text-xl font-light underline hover:no-underline transition-all duration-300 self-start laptop:self-center"
        >
          See all
        </Link>
      </div>

      {/* Portfolio Grid */}
      {portfolioItems.length > 0 ? (
        <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-8 laptop:gap-12">
          {portfolioItems.map((item) => (
            <PortfolioCard
              key={item.id}
              id={item.id}
              title={item.title}
              slug={item.slug}
              summary={item.summary}
              images={item.images}
              techStack={item.techStack}
              contributions={item.contributions}
              features={item.features}
              onClick={() => handleCardClick(item.slug)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-500">
          No portfolio items available
        </div>
      )}
    </div>
  );
}

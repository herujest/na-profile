"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PartnerCard from "@/components/PartnerCard";

interface PartnerCategory {
  id: string;
  name: string;
  slug: string;
}

interface PartnerRank {
  id: string;
  name: string;
  slug: string;
}

interface PartnerSocial {
  id: string;
  platform: string;
  handle: string;
  url?: string;
  order: number;
}

interface Partner {
  id: string;
  name: string;
  category?: string | PartnerCategory; // Legacy string or object from API
  categoryId?: string;
  categoryRelation?: PartnerCategory;
  description?: string;
  location?: string;
  whatsapp?: string; // Legacy
  instagram?: string; // Legacy
  email?: string;
  priceRange?: string;
  portfolioUrl?: string;
  avatarUrl?: string;
  tags: string[];
  collaborationCount: number;
  notes?: string;
  internalRank?: number;
  rankId?: string;
  rank?: PartnerRank;
  socials?: PartnerSocial[];
}

const Collaboration: React.FC = () => {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [availableCategories, setAvailableCategories] = useState<string[]>([
    "All",
  ]);
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("masonry");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "All",
    "MUA",
    "Photographer",
    "Videographer",
    "Stylist",
    "Wardrobe",
    "Others",
  ];

  useEffect(() => {
    fetchPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      // Fetch categories first to build filter
      const categoriesRes = await fetch("/api/partner-categories");
      let categoryList: PartnerCategory[] = [];
      if (categoriesRes.ok) {
        categoryList = await categoriesRes.json();
      }

      // Build category filter
      let categoryParam = "";
      if (selectedCategory !== "All") {
        const category = categoryList.find((c) => c.name === selectedCategory);
        if (category) {
          categoryParam = `?categoryId=${category.id}`;
        } else if (selectedCategory === "Others") {
          // For "Others", we'll filter client-side
          categoryParam = "";
        } else {
          // Legacy category support
          categoryParam = `?category=${selectedCategory}`;
        }
      }

      const res = await fetch(`/api/partners${categoryParam}`);
      if (res.ok) {
        const data = await res.json();
        // Handle both formats: array or { partners }
        let fetchedPartners = Array.isArray(data) ? data : data.partners || [];

        // Filter for "Others" category
        if (selectedCategory === "Others") {
          const mainCategoryNames = categoryList.map((c) => c.name);
          fetchedPartners = fetchedPartners.filter((p: Partner) => {
            const categoryName =
              p.categoryRelation?.name ||
              (typeof p.category === "object" && p.category?.name) ||
              (typeof p.category === "string" ? p.category : null);
            return categoryName && !mainCategoryNames.includes(categoryName);
          });
        }

        setPartners(fetchedPartners);
      }
    } catch (error) {
      console.error("Failed to fetch partners:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for filter buttons
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/partner-categories");
        if (res.ok) {
          const data = await res.json();
          const categoryNames = data.map((c: PartnerCategory) => c.name);
          setAvailableCategories(["All", ...categoryNames, "Others"]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Filter partners by search query
  const filteredPartners = partners.filter((partner) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    const name = partner.name.toLowerCase();
    const description = partner.description?.toLowerCase() || "";
    const location = partner.location?.toLowerCase() || "";
    const tags = partner.tags?.join(" ").toLowerCase() || "";
    const categoryName = (
      partner.categoryRelation?.name ||
      (typeof partner.category === "object" && partner.category?.name) ||
      (typeof partner.category === "string" ? partner.category : null) ||
      ""
    ).toLowerCase();

    return (
      name.includes(query) ||
      description.includes(query) ||
      location.includes(query) ||
      tags.includes(query) ||
      categoryName.includes(query)
    );
  });

  return (
    <div className="w-full">
      {/* Category Filter, Search Bar & View Mode Toggle - Single Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-10 pb-4 border-b border-gray-200 dark:border-gray-700">
        {/* Category Filter - Left */}
        <div className="flex flex-wrap gap-3 flex-1">
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Bar & View Mode Toggle - Right */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  className="h-4 w-4"
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
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode("masonry")}
              className={`px-3 py-2 rounded-md font-medium transition-all ${
                viewMode === "masonry"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
              title="Masonry View"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 rounded-md font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
              title="Grid View"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Partners Grid/Masonry */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading partners...
            </p>
          </div>
        </div>
      ) : filteredPartners.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {searchQuery
              ? `No partners found matching "${searchQuery}"`
              : "No partners found in this category"}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      ) : viewMode === "masonry" ? (
        <div className="columns-1 mob:columns-1 tablet:columns-2 laptop:columns-3 gap-6 space-y-6">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              onClick={() => router.push(`/partner/${partner.id}`)}
              className="break-inside-avoid cursor-pointer mb-6"
            >
              <PartnerCard
                partner={partner}
                onClick={() => router.push(`/partner/${partner.id}`)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 mob:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-10">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              onClick={() => router.push(`/partner/${partner.id}`)}
              className="cursor-pointer"
            >
              <PartnerCard
                partner={partner}
                onClick={() => router.push(`/partner/${partner.id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collaboration;

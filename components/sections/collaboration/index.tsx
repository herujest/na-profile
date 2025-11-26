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
  category?: string; // Legacy
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
            const categoryName = p.categoryRelation?.name || p.category;
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

  const filteredPartners = partners;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading partners...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-10">
        {availableCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === category
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Partners Grid */}
      {filteredPartners.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No partners found in this category
          </p>
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

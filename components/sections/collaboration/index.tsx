"use client";

import { useState, useEffect } from "react";
import PartnerCard from "@/components/PartnerCard";
import PartnerDetail from "@/components/PartnerDetail";

interface Partner {
  id: string;
  name: string;
  category: string;
  description?: string;
  location?: string;
  whatsapp?: string;
  instagram?: string;
  email?: string;
  priceRange?: string;
  portfolioUrl?: string;
  avatarUrl?: string;
  tags: string[];
  collaborationCount: number;
  notes?: string;
  internalRank?: number;
}

const Collaboration: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

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
      const categoryParam =
        selectedCategory === "All" ? "" : `?category=${selectedCategory}`;
      const res = await fetch(`/api/partners${categoryParam}`);
      if (res.ok) {
        const data = await res.json();
        // Handle both formats: array or { partners }
        setPartners(Array.isArray(data) ? data : data.partners || []);
      }
    } catch (error) {
      console.error("Failed to fetch partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners =
    selectedCategory === "All"
      ? partners
      : partners.filter((p) => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading partners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map((category) => (
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
              onClick={() => setSelectedPartner(partner)}
              className="cursor-pointer"
            >
              <PartnerCard
                id={partner.id}
                name={partner.name}
                category={partner.category}
                description={partner.description}
                location={partner.location}
                whatsapp={partner.whatsapp}
                instagram={partner.instagram}
                email={partner.email}
                priceRange={partner.priceRange}
                portfolioUrl={partner.portfolioUrl}
                avatarUrl={partner.avatarUrl}
                tags={partner.tags}
                collaborationCount={partner.collaborationCount}
                notes={partner.notes}
                internalRank={partner.internalRank}
              />
            </div>
          ))}
        </div>
      )}

      {/* Partner Detail Modal */}
      {selectedPartner && (
        <PartnerDetail
          partner={selectedPartner}
          onClose={() => setSelectedPartner(null)}
        />
      )}
    </div>
  );
};

export default Collaboration;

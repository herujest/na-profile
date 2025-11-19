import { useState, useEffect } from "react";
import PartnerCard from "../../../components/PartnerCard";
import PartnerDetail from "../../../components/PartnerDetail";

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
        setPartners(data);
      } else {
        console.error("Failed to fetch partners");
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePartnerClick = async (partnerId: string) => {
    try {
      const res = await fetch(`/api/partners/${partnerId}`);
      if (res.ok) {
        const partner = await res.json();
        setSelectedPartner(partner);
      }
    } catch (error) {
      console.error("Error fetching partner details:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full mt-10 laptop:mt-30 p-2 laptop:p-0">
        <div className="py-20 text-center">Loading partners...</div>
      </div>
    );
  }

  return (
    <div className="w-full mt-10 laptop:mt-30 p-2 laptop:p-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Partner in Collaborations.</h1>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Partners Grid */}
      {partners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              onClick={() => handlePartnerClick(partner.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-500 dark:text-gray-400">
          No partners found in this category.
        </div>
      )}

      {/* Partner Detail Modal */}
      {selectedPartner && (
        <PartnerDetail
          partner={selectedPartner}
          onClose={() => setSelectedPartner(null)}
          isAdmin={process.env.NODE_ENV === "development"}
        />
      )}
    </div>
  );
};

export default Collaboration;

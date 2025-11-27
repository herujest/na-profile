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

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      // Always fetch top 6 partners sorted by collaborationCount
      const res = await fetch(
        `/api/partners?sort=collaborationCount&order=desc&limit=6`
      );
      if (res.ok) {
        const data = await res.json();
        // Handle both formats: array or { partners }
        let fetchedPartners = Array.isArray(data) ? data : data.partners || [];

        // Sort by collaborationCount (descending) and limit to 6
        fetchedPartners = fetchedPartners
          .sort((a: Partner, b: Partner) => {
            return (b.collaborationCount || 0) - (a.collaborationCount || 0);
          })
          .slice(0, 6);

        setPartners(fetchedPartners);
      }
    } catch (error) {
      console.error("Failed to fetch partners:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Partners Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading partners...
            </p>
          </div>
        </div>
      ) : partners.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No partners found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 mob:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-10">
          {partners.map((partner) => (
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

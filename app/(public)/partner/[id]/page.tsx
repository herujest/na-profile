"use client";

export const dynamic = 'error';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PartnerDetailContent from "@/components/PartnerDetail/PartnerDetailContent";

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

interface Portfolio {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  images: string[];
  datePublished?: string;
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
  portfolios?: Portfolio[];
}

export default function PartnerDetailPage() {
  const params = useParams();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        setLoading(true);
        const id = params.id as string;
        const res = await fetch(`/api/partners/${id}`);
        
        if (res.ok) {
          const data = await res.json();
          setPartner(data);
        } else if (res.status === 404) {
          setError("Partner not found");
        } else {
          setError("Failed to load partner");
        }
      } catch (err) {
        console.error("Error fetching partner:", err);
        setError("Error loading partner");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPartner();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading partner...</p>
        </div>
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || "Partner not found"}
          </h1>
          <Link
            href="/#collaboration"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Partners
          </Link>
        </div>
      </div>
    );
  }

  return <PartnerDetailContent partner={partner} />;
}


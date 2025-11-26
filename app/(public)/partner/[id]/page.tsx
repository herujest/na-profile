"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PartnerDetail from "@/components/PartnerDetail";

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
  const router = useRouter();
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Back Button */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/#collaboration"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Partners
          </Link>
        </div>
      </div>

      {/* Partner Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PartnerDetail partner={partner} onClose={() => router.push("/#collaboration")} />

        {/* Portfolios Section */}
        {partner.portfolios && partner.portfolios.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Collaborations ({partner.portfolios.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partner.portfolios.map((portfolio) => (
                <Link
                  key={portfolio.id}
                  href={`/portfolio/${portfolio.slug}`}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  {portfolio.images && portfolio.images.length > 0 && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={portfolio.images[0]}
                        alt={portfolio.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {portfolio.title}
                    </h3>
                    {portfolio.summary && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {portfolio.summary}
                      </p>
                    )}
                    {portfolio.datePublished && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {new Date(portfolio.datePublished).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


"use client";

import Link from "next/link";
import Image from "next/image";
import type { PortfolioPartner } from "./types";

interface PartnerCardProps {
  partner: PortfolioPartner;
}

export default function PartnerCard({ partner }: PartnerCardProps) {
  const getCategoryColor = (categoryName?: string) => {
    const colors: Record<string, string> = {
      MUA: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      Photographer:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Videographer:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Stylist:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Wardrobe:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return (
      colors[categoryName || ""] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    );
  };

  return (
    <Link
      href={`/partner/${partner.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {partner.avatarUrl ? (
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 transition-all">
                <Image
                  src={partner.avatarUrl}
                  alt={partner.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 transition-all">
                {partner.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {partner.name}
              </h3>
            </div>

            {/* Category & Rank */}
            <div className="flex flex-wrap gap-2 mb-3">
              {partner.category && (
                <span
                  className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(
                    partner.category.name
                  )}`}
                >
                  {partner.category.name}
                </span>
              )}
              {partner.rank && (
                <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  {partner.rank.name}
                </span>
              )}
            </div>

            {/* Location */}
            {partner.location && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {partner.location}
              </div>
            )}

            {/* Description */}
            {partner.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">
                {partner.description}
              </p>
            )}

            {/* View Partner Link */}
            <div className="mt-3 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
              <span>View Partner Profile</span>
              <svg
                className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}


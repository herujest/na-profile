import React from "react";
import Image from "next/image";

interface Partner {
  id: string;
  name: string;
  category: string;
  location?: string;
  priceRange?: string;
  tags: string[];
  collaborationCount: number;
  avatarUrl?: string;
}

interface PartnerCardProps {
  partner: Partner;
  onClick: () => void;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner, onClick }) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      MUA: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      Photographer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Videographer: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Stylist: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Wardrobe: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
        {partner.avatarUrl ? (
          <Image
            src={partner.avatarUrl}
            alt={partner.name}
            layout="fill"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
              {partner.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white flex-1">
            {partner.name}
          </h3>
        </div>

        {/* Category Badge */}
        <div className="mb-3">
          <span
            className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${getCategoryColor(
              partner.category
            )}`}
          >
            {partner.category}
          </span>
        </div>

        {/* Location */}
        {partner.location && (
          <div className="mb-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
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

        {/* Price Range */}
        {partner.priceRange && (
          <div className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
            {partner.priceRange}
          </div>
        )}

        {/* Tags */}
        {partner.tags && partner.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {partner.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {partner.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{partner.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Collaboration Count */}
        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {partner.collaborationCount} collaboration
            {partner.collaborationCount !== 1 ? "s" : ""}
          </span>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerCard;


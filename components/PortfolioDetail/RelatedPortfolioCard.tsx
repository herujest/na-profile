"use client";

import Link from "next/link";
import Image from "next/image";
import type { PortfolioItem } from "./types";
import { getImageSrc } from "./utils";

interface RelatedPortfolioCardProps {
  portfolio: PortfolioItem;
}

export default function RelatedPortfolioCard({
  portfolio,
}: RelatedPortfolioCardProps) {
  return (
    <Link
      href={`/portfolio/${portfolio.slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700"
    >
      {/* Image */}
      <div 
        className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900"
        style={{ 
          minHeight: '200px', 
          maxHeight: '280px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {portfolio.images && portfolio.images.length > 0 ? (
          <>
            <Image
              src={getImageSrc(portfolio.images[0])}
              alt={portfolio.title}
              fill
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-500 z-10"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ minHeight: '200px' }}>
            <svg
              className="w-10 h-10 text-gray-400 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-medium text-xs text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
          {portfolio.title}
        </h3>
        {portfolio.datePublished && (
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {new Date(portfolio.datePublished).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </Link>
  );
}


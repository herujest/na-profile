"use client";

interface PortfolioMetadataProps {
  summary?: string;
  categories?: string[];
  tags?: string[];
  brands?: string[];
}

export default function PortfolioMetadata({
  summary,
  categories,
  tags,
  brands,
}: PortfolioMetadataProps) {
  return (
    <div className="space-y-8 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      {/* Summary Section */}
      {summary && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
            About This Project
          </h3>
          <div className="max-w-4xl">
            <p className="text-base laptop:text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {summary}
            </p>
          </div>
        </div>
      )}

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
            Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Brands */}
      {brands && brands.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
            Brands
          </h3>
          <div className="flex flex-wrap gap-2">
            {brands.map((brand, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


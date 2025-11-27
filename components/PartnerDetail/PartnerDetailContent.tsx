"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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
  category?: string | PartnerCategory;
  categoryId?: string;
  categoryRelation?: PartnerCategory;
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
  rankId?: string;
  rank?: PartnerRank;
  socials?: PartnerSocial[];
  portfolios?: Portfolio[];
}

interface PartnerDetailContentProps {
  partner: Partner;
}

const PartnerDetailContent: React.FC<PartnerDetailContentProps> = ({
  partner,
}) => {
  const [instagramUsername, setInstagramUsername] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Extract Instagram username from socials or legacy instagram field
    const instagramSocial = partner.socials?.find(
      (s) => s.platform.toLowerCase() === "instagram"
    );

    if (instagramSocial) {
      // Extract username from handle (remove @ if present)
      const username = instagramSocial.handle.replace("@", "").trim();
      if (username) {
        setInstagramUsername(username);
      } else if (instagramSocial.url) {
        // Try to extract from URL
        const match = instagramSocial.url.match(/instagram\.com\/([^\/\?]+)/);
        if (match && match[1]) {
          setInstagramUsername(match[1]);
        }
      }
    } else if (partner.instagram) {
      // Legacy instagram field
      const username = partner.instagram.replace("@", "").trim();
      setInstagramUsername(username);
    }
  }, [partner]);

  const getCategoryColor = (category: string) => {
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
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    );
  };

  const getCategoryName = () => {
    return (
      partner.categoryRelation?.name ||
      (typeof partner.category === "object" && partner.category?.name) ||
      (typeof partner.category === "string" ? partner.category : null) ||
      "Others"
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
      <div className="container mx-auto px-4 laptop:px-0">
        <div className="py-8 laptop:py-12">
          {/* Back Button */}
          <Link
            href="/#collaboration"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
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

          {/* Partner Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header with Avatar */}
            <div className="mb-12">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                {partner.avatarUrl ? (
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-gray-200 dark:ring-gray-800">
                    <Image
                      src={partner.avatarUrl}
                      alt={partner.name}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-5xl md:text-6xl font-bold flex-shrink-0 ring-4 ring-gray-200 dark:ring-gray-800">
                    {partner.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${getCategoryColor(
                        getCategoryName()
                      )}`}
                    >
                      {getCategoryName()}
                    </span>
                    {partner.rank && (
                      <span className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        {partner.rank.name}
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                    {partner.name}
                  </h1>
                  {partner.location && (
                    <p className="text-lg text-gray-600 dark:text-gray-400 flex items-center">
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
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {partner.description && (
              <div className="mb-12">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {partner.description}
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {partner.priceRange && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center text-lg">
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Price Range
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 font-medium text-xl">
                    {partner.priceRange}
                  </p>
                </div>
              )}

              {partner.collaborationCount > 0 && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center text-lg">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Collaborations
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 font-medium text-xl">
                    {partner.collaborationCount} collaboration
                    {partner.collaborationCount !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>

            {/* Tags */}
            {partner.tags && partner.tags.length > 0 && (
              <div className="mb-12">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-xl">
                  Specializations
                </h3>
                <div className="flex flex-wrap gap-3">
                  {partner.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media Links */}
            {(partner.socials && partner.socials.length > 0) ||
            partner.whatsapp ||
            partner.instagram ||
            partner.email ? (
              <div className="mb-12">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-xl">
                  Contact & Social Media
                </h3>
                <div className="flex flex-wrap gap-3">
                  {partner.socials?.map((social) => {
                    const getSocialUrl = () => {
                      if (social.url) return social.url;
                      switch (social.platform.toLowerCase()) {
                        case "instagram":
                          return `https://instagram.com/${social.handle.replace(
                            "@",
                            ""
                          )}`;
                        case "whatsapp":
                          return `https://wa.me/${social.handle.replace(
                            /\D/g,
                            ""
                          )}`;
                        case "tiktok":
                          return `https://tiktok.com/@${social.handle.replace(
                            "@",
                            ""
                          )}`;
                        case "facebook":
                          return `https://facebook.com/${social.handle.replace(
                            "@",
                            ""
                          )}`;
                        case "twitter":
                          return `https://twitter.com/${social.handle.replace(
                            "@",
                            ""
                          )}`;
                        case "youtube":
                          return `https://youtube.com/@${social.handle.replace(
                            "@",
                            ""
                          )}`;
                        default:
                          return `https://${social.platform}.com/${social.handle}`;
                      }
                    };

                    const getSocialIcon = () => {
                      switch (social.platform.toLowerCase()) {
                        case "instagram":
                          return (
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                          );
                        case "whatsapp":
                          return (
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                          );
                        default:
                          return (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              />
                            </svg>
                          );
                      }
                    };

                    return (
                      <a
                        key={social.id}
                        href={getSocialUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg transition-colors capitalize font-medium"
                      >
                        {getSocialIcon()}
                        <span>{social.platform}</span>
                      </a>
                    );
                  })}

                  {/* Legacy contact fields */}
                  {partner.whatsapp &&
                    !partner.socials?.some(
                      (s) => s.platform.toLowerCase() === "whatsapp"
                    ) && (
                      <a
                        href={`https://wa.me/${partner.whatsapp.replace(
                          /\D/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg transition-colors font-medium"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        <span>WhatsApp</span>
                      </a>
                    )}
                  {partner.instagram &&
                    !partner.socials?.some(
                      (s) => s.platform.toLowerCase() === "instagram"
                    ) && (
                      <a
                        href={`https://instagram.com/${partner.instagram.replace(
                          "@",
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-5 py-3 rounded-lg transition-colors font-medium"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span>Instagram</span>
                      </a>
                    )}
                  {partner.email && (
                    <a
                      href={`mailto:${partner.email}`}
                      className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-lg transition-colors font-medium"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Email</span>
                    </a>
                  )}
                </div>
              </div>
            ) : null}

            {/* Portfolio URL */}
            {partner.portfolioUrl && (
              <div className="mb-12">
                <a
                  href={partner.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-lg"
                >
                  <span>View Portfolio</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            )}

            {/* Instagram Embed Section */}
            {instagramUsername && (
              <div className="mb-12">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-6 text-xl">
                  Instagram Profile
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                  <div className="w-full bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
                    <iframe
                      src={`https://www.instagram.com/${instagramUsername}/embed`}
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency={true}
                      className="w-full"
                      style={{
                        height: 620,
                        borderRadius: 12,
                        backgroundColor: "transparent",
                      }}
                      title={`Instagram profile for ${instagramUsername}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Related Portfolios Section */}
            {partner.portfolios && partner.portfolios.length > 0 ? (
              <div className="mb-12 mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Related Portfolios
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Portfolios featuring {partner.name}
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                    {partner.portfolios.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partner.portfolios.map((portfolio) => (
                    <Link
                      key={portfolio.id}
                      href={`/portfolio/${portfolio.slug}`}
                      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-200 dark:border-gray-700"
                    >
                      {portfolio.images && portfolio.images.length > 0 ? (
                        <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <Image
                            src={portfolio.images[0]}
                            alt={portfolio.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      ) : (
                        <div className="relative h-56 w-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-gray-400 dark:text-gray-600"
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
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                          {portfolio.title}
                        </h3>
                        {portfolio.summary && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                            {portfolio.summary}
                          </p>
                        )}
                        {portfolio.datePublished && (
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {new Date(
                              portfolio.datePublished
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetailContent;

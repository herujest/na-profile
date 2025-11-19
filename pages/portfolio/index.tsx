import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import PortfolioCard from "../../components/PortfolioCard";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  images: string[];
  techStack?: string[];
  contributions?: string[];
  features?: string[];
  featured?: boolean;
}

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // Fetch all portfolio items (not just featured)
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const data = await res.json();
          setPortfolioItems(data.items || []);
        }
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const handleCardClick = (slug: string) => {
    // Navigate to portfolio detail page or show modal
    window.location.href = `/portfolio/${slug}`;
  };

  return (
    <>
      <Head>
        <title>Portfolio - Nisa Aulia</title>
        <meta name="description" content="View all portfolio works by Nisa Aulia" />
      </Head>
      <Header />
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="w-full px-4 laptop:px-0 max-w-7xl mx-auto py-20">
          {/* Page Header */}
          <div className="mb-16 laptop:mb-24">
            <Link href="/">
              <a className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors">
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Home
              </a>
            </Link>
            <h1 className="text-4xl laptop:text-6xl laptopl:text-7xl font-light leading-tight mb-4">
              All Portfolio
            </h1>
            <p className="text-lg laptop:text-xl text-gray-600 dark:text-gray-400">
              Explore all my work and projects
            </p>
          </div>

          {/* Portfolio Grid */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading portfolio...
              </p>
            </div>
          ) : portfolioItems.length > 0 ? (
            <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-8 laptop:gap-12">
              {portfolioItems.map((item) => (
                <div key={item.id} className="relative">
                  {item.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                        <span>⭐</span>
                        Featured
                      </span>
                    </div>
                  )}
                  <PortfolioCard
                    id={item.id}
                    title={item.title}
                    slug={item.slug}
                    summary={item.summary}
                    images={item.images}
                    techStack={item.techStack}
                    contributions={item.contributions}
                    features={item.features}
                    onClick={() => handleCardClick(item.slug)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg">No portfolio items available</p>
              <Link href="/">
                <a className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
                  Go back to home
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}


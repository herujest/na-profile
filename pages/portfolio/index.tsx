import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import PortfolioCard from "../../components/PortfolioCard";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Text, Button, Badge } from "../../components/atoms";

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
        <meta
          name="description"
          content="View all portfolio works by Nisa Aulia"
        />
      </Head>
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
        <div className="container mx-auto">
          <Header />
          <div
            className="w-full px-4 laptop:px-0"
            style={{ paddingBlock: "50px" }}
          >
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
              <Text variant="h1" className="mb-4">
                All Portfolio
              </Text>
              <Text variant="body" className="text-lg laptop:text-xl">
                Explore all my work and projects
              </Text>
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
                        <Badge variant="warning" size="md">
                          <span>⭐</span> Featured
                        </Badge>
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
              <div className="py-20 text-center">
                <Text variant="body" className="text-lg mb-4">
                  No portfolio items available
                </Text>
                <Button href="/" variant="primary" size="md">
                  Go back to home
                </Button>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

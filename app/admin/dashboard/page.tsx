"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Metadata is handled by layout.tsx in App Router for client components

interface DashboardData {
  portfolioItems: any[];
  services: any[];
  socials: any[];
  partners: any[];
  resume: any;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from actual API endpoints (all database-backed)
        const [portfolioRes, servicesRes, socialsRes, partnersRes] =
          await Promise.all([
            fetch("/api/portfolio"),
            fetch("/api/services"),
            fetch("/api/socials"),
            fetch("/api/partners"),
          ]);

        const portfolioData = portfolioRes.ok
          ? await portfolioRes.json()
          : { portfolioItems: [] };
        const servicesData = servicesRes.ok
          ? await servicesRes.json()
          : { services: [] };
        const socialsData = socialsRes.ok
          ? await socialsRes.json()
          : { socials: [] };
        // Partners API returns array directly
        const partnersData = partnersRes.ok ? await partnersRes.json() : [];

        // Resume data is still in portfolio.json (not migrated to database yet)
        // For now, we'll fetch it from the portfolio API with admin=true
        // This is a temporary solution until resume is migrated to database
        let resumeData = { experiences: [] };
        try {
          const resumeRes = await fetch("/api/portfolio?admin=true");
          if (resumeRes.ok) {
            const resumeResult = await resumeRes.json();
            resumeData = resumeResult.resume || { experiences: [] };
          }
        } catch (error) {
          console.error("Error fetching resume data:", error);
        }

        setData({
          portfolioItems: portfolioData.portfolioItems || [],
          services: servicesData.services || [],
          socials: socialsData.socials || [],
          partners: Array.isArray(partnersData) ? partnersData : [],
          resume: resumeData,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set default empty data on error
        setData({
          portfolioItems: [],
          services: [],
          socials: [],
          partners: [],
          resume: { experiences: [] },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-red-600">
        Failed to load data
      </div>
    );
  }

  const stats = [
    {
      label: "Portfolio Items",
      value: data.portfolioItems?.length || 0,
      icon: "🖼️",
      color: "bg-blue-500",
      source: "Database (Portfolio API)",
    },
    {
      label: "Services",
      value: data.services?.length || 0,
      icon: "💼",
      color: "bg-green-500",
      source: "Database (Services API)",
    },
    {
      label: "Social Links",
      value: data.socials?.length || 0,
      icon: "🔗",
      color: "bg-purple-500",
      source: "Database (Socials API)",
    },
    {
      label: "Partners",
      value: data.partners?.length || 0,
      icon: "🤝",
      color: "bg-indigo-500",
      source: "Database (Partners API)",
    },
    {
      label: "Resume Experiences",
      value: data.resume?.experiences?.length || 0,
      icon: "📄",
      color: "bg-orange-500",
      source: "Portfolio.json (Temporary)",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to the CMS Admin Panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {stat.source}
                </p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/portfolio"
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="text-2xl mb-2">🖼️</div>
            <div className="font-medium text-gray-900 dark:text-white">
              Manage Portfolio
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Add, edit, or delete portfolio items
            </div>
          </a>
          <a
            href="/admin/services"
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="text-2xl mb-2">💼</div>
            <div className="font-medium text-gray-900 dark:text-white">
              Manage Services
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Update your services
            </div>
          </a>
          <a
            href="/admin/partners"
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="text-2xl mb-2">🤝</div>
            <div className="font-medium text-gray-900 dark:text-white">
              Manage Partners
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Collaboration partners
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

// Metadata is handled by layout.tsx in App Router for client components


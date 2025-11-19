import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/AdminLayout";

interface PortfolioData {
  name: string;
  portfolioItems: any[];
  services: any[];
  socials: any[];
  resume: any;
}

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      router.push("/");
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/portfolio?admin=true");
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-20">Loading...</div>
      </AdminLayout>
    );
  }

  if (!data) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-red-600">
          Failed to load data
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    {
      label: "Portfolio Items",
      value: data.portfolioItems?.length || 0,
      icon: "🖼️",
      color: "bg-blue-500",
    },
    {
      label: "Services",
      value: data.services?.length || 0,
      icon: "💼",
      color: "bg-green-500",
    },
    {
      label: "Social Links",
      value: data.socials?.length || 0,
      icon: "🔗",
      color: "bg-purple-500",
    },
    {
      label: "Resume Experiences",
      value: data.resume?.experiences?.length || 0,
      icon: "📄",
      color: "bg-orange-500",
    },
  ];

  return (
    <AdminLayout>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
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
    </AdminLayout>
  );
};

export default DashboardPage;


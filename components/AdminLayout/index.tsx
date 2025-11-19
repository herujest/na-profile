import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const handleLogout = async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/admin/login";
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check authentication
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthenticated(true);
        } else {
          router.replace("/admin/login");
        }
      })
      .catch(() => {
        router.replace("/admin/login");
      })
      .finally(() => {
        setChecking(false);
      });
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      path: "/admin/dashboard",
      exact: true,
    },
    {
      id: "header",
      label: "Header",
      icon: "🎯",
      path: "/admin/header",
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: "🖼️",
      path: "/admin/portfolio",
    },
    {
      id: "services",
      label: "Services",
      icon: "💼",
      path: "/admin/services",
    },
    {
      id: "about",
      label: "About",
      icon: "ℹ️",
      path: "/admin/about",
    },
    {
      id: "socials",
      label: "Socials",
      icon: "🔗",
      path: "/admin/socials",
    },
    {
      id: "resume",
      label: "Resume",
      icon: "📄",
      path: "/admin/resume",
    },
    {
      id: "partners",
      label: "Partners",
      icon: "🤝",
      path: "/admin/partners",
    },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return router.pathname === path;
    }
    return router.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar - Fixed */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col z-50`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              CMS Admin
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link key={item.id} href={item.path}>
              <a
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path, item.exact)
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </a>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 space-y-2">
          <Link href="/">
            <a className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="text-xl">🏠</span>
              {sidebarOpen && <span className="font-medium">View Site</span>}
            </a>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <span className="text-xl">🚪</span>
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content - With margin for fixed sidebar */}
      <main
        className={`flex-1 overflow-y-auto ${
          sidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <div className="container mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;

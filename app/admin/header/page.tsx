"use client";

export const dynamic = 'error';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PortfolioData {
  name: string;
  headerTaglineOne: string;
  headerTaglineTwo: string;
  headerTaglineThree: string;
  headerTaglineFour: string;
  showCursor: boolean;
  showBlog: boolean;
  darkMode: boolean;
  showResume: boolean;
}

const HeaderPage: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const result = await res.json();
        setData({
          name: result.name || "",
          headerTaglineOne: result.headerTaglineOne || "",
          headerTaglineTwo: result.headerTaglineTwo || "",
          headerTaglineThree: result.headerTaglineThree || "",
          headerTaglineFour: result.headerTaglineFour || "",
          showCursor: result.showCursor || false,
          showBlog: result.showBlog || false,
          darkMode: result.darkMode || false,
          showResume: result.showResume || false,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const saveRes = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (saveRes.ok) {
        alert("Header settings saved successfully!");
        // Refresh data to get updated values
        await fetchData();
      } else {
        const errorData = await saveRes.json();
        alert(`Failed to save data: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Header Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage header content and display settings
          </p>
        </div>
        <button
          onClick={saveData}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "💾 Save Changes"}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Taglines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tagline 1
            </label>
            <input
              type="text"
              value={data.headerTaglineOne}
              onChange={(e) =>
                setData({ ...data, headerTaglineOne: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tagline 2
            </label>
            <input
              type="text"
              value={data.headerTaglineTwo}
              onChange={(e) =>
                setData({ ...data, headerTaglineTwo: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tagline 3
            </label>
            <input
              type="text"
              value={data.headerTaglineThree}
              onChange={(e) =>
                setData({ ...data, headerTaglineThree: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tagline 4
            </label>
            <input
              type="text"
              value={data.headerTaglineFour}
              onChange={(e) =>
                setData({ ...data, headerTaglineFour: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Toggle Settings */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Display Settings
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="checkbox"
                checked={data.showCursor}
                onChange={(e) =>
                  setData({ ...data, showCursor: e.target.checked })
                }
                className="w-5 h-5"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Show Cursor
              </span>
            </label>
            <label className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="checkbox"
                checked={data.showBlog}
                onChange={(e) =>
                  setData({ ...data, showBlog: e.target.checked })
                }
                className="w-5 h-5"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Show Blog
              </span>
            </label>
            <label className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="checkbox"
                checked={data.darkMode}
                onChange={(e) =>
                  setData({ ...data, darkMode: e.target.checked })
                }
                className="w-5 h-5"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Dark Mode
              </span>
            </label>
            <label className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="checkbox"
                checked={data.showResume}
                onChange={(e) =>
                  setData({ ...data, showResume: e.target.checked })
                }
                className="w-5 h-5"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Show Resume
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderPage;


"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AboutPage: React.FC = () => {
  const router = useRouter();
  const [aboutPara, setAboutPara] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setAboutPara(data.aboutPara || "");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    setSaving(true);
    try {
      const saveRes = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aboutPara }),
      });

      if (saveRes.ok) {
        alert("About section saved successfully!");
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

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            About Section
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Edit the about paragraph displayed on the home page
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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          About Paragraph
        </label>
        <textarea
          value={aboutPara}
          onChange={(e) => setAboutPara(e.target.value)}
          rows={20}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
          placeholder="Enter your about paragraph here..."
        />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {aboutPara.length} characters
        </p>
      </div>
    </div>
  );
};

export default AboutPage;


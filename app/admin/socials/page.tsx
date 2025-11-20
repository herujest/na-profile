"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { v4 as uuidv4 } from "uuid";

interface Social {
  id: string;
  title: string;
  link: string;
}

const SocialsPage: React.FC = () => {
  const router = useRouter();
  const [socials, setSocials] = useState<Social[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        const data = await res.json();
        setSocials(data.socials || []);
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
      const res = await fetch("/api/portfolio?admin=true");
      if (res.ok) {
        const data = await res.json();
        const updatedData = { ...data, socials };
        const saveRes = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });

        if (saveRes.ok) {
          alert("Social links saved successfully!");
        } else {
          alert("Failed to save data");
        }
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  const addSocial = () => {
    const newSocial = {
      id: uuidv4(),
      title: "New Social",
      link: "",
    };
    setSocials([...socials, newSocial]);
  };

  const updateSocial = (index: number, field: string, value: string) => {
    const updated = [...socials];
    updated[index] = { ...updated[index], [field]: value };
    setSocials(updated);
  };

  const deleteSocial = (index: number) => {
    if (confirm("Are you sure you want to delete this social link?")) {
      const updated = socials.filter((_, i) => i !== index);
      setSocials(updated);
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

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Social Media Links
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your social media links and profiles
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={addSocial}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Add Social Link
            </button>
            <button
              onClick={saveData}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "💾 Save All"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {socials.map((social, index) => (
            <div
              key={social.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {social.title || `Social ${index + 1}`}
                </h3>
                <button
                  onClick={() => deleteSocial(index)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={social.title || ""}
                    onChange={(e) =>
                      updateSocial(index, "title", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Instagram, TikTok, Email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Link
                  </label>
                  <input
                    type="text"
                    value={social.link || ""}
                    onChange={(e) =>
                      updateSocial(index, "link", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          ))}
          {socials.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No social links yet. Click "Add Social Link" to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SocialsPage;


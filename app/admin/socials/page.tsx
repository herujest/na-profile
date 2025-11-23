"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const [showModal, setShowModal] = useState(false);
  const [newSocial, setNewSocial] = useState<{ title: string; link: string }>({
    title: "",
    link: "",
  });
  const [savingNew, setSavingNew] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/socials");
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

  const saveSocial = async (social: Social, index: number) => {
    try {
      if (social.id && social.id.startsWith("temp-")) {
        // New social - create it
        const res = await fetch("/api/socials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: social.title,
            link: social.link,
            order: index,
          }),
        });

        if (res.ok) {
          const newSocial = await res.json();
          // Update local state with the new social ID
          const updated = [...socials];
          updated[index] = newSocial;
          setSocials(updated);
          return true;
        } else {
          const errorData = await res.json();
          alert(`Failed to create social: ${errorData.error || "Unknown error"}`);
          return false;
        }
      } else {
        // Existing social - update it
        const res = await fetch(`/api/socials/${social.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: social.title,
            link: social.link,
            order: index,
          }),
        });

        if (res.ok) {
          return true;
        } else {
          const errorData = await res.json();
          alert(`Failed to update social: ${errorData.error || "Unknown error"}`);
          return false;
        }
      }
    } catch (error) {
      console.error("Error saving social:", error);
      alert("Error saving social");
      return false;
    }
  };

  const saveAllData = async () => {
    setSaving(true);
    try {
      // Save all socials
      const savePromises = socials.map((social, index) =>
        saveSocial(social, index)
      );
      const results = await Promise.all(savePromises);

      if (results.every((r) => r === true)) {
        alert("All social links saved successfully!");
        // Refresh data to get updated IDs
        await fetchData();
      } else {
        alert("Some social links failed to save. Please check and try again.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setNewSocial({ title: "", link: "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewSocial({ title: "", link: "" });
  };

  const handleSaveNewSocial = async () => {
    // Validation
    if (!newSocial.title.trim() || !newSocial.link.trim()) {
      alert("Please fill in both title and link fields");
      return;
    }

    setSavingNew(true);
    try {
      const res = await fetch("/api/socials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newSocial.title.trim(),
          link: newSocial.link.trim(),
          order: socials.length,
        }),
      });

      if (res.ok) {
        const savedSocial = await res.json();
        setSocials([...socials, savedSocial]);
        closeModal();
        alert("Social link added successfully!");
      } else {
        const errorData = await res.json();
        alert(`Failed to create social: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating social:", error);
      alert("Error creating social");
    } finally {
      setSavingNew(false);
    }
  };

  const updateSocial = (index: number, field: string, value: string) => {
    const updated = [...socials];
    updated[index] = { ...updated[index], [field]: value };
    setSocials(updated);
  };

  const deleteSocial = async (index: number) => {
    const social = socials[index];
    if (!social) return;

    if (confirm("Are you sure you want to delete this social link?")) {
      // If it's a temporary social (not saved yet), just remove from state
      if (social.id.startsWith("temp-")) {
        const updated = socials.filter((_, i) => i !== index);
        setSocials(updated);
        return;
      }

      // Otherwise, delete from API
      try {
        const res = await fetch(`/api/socials/${social.id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          const updated = socials.filter((_, i) => i !== index);
          setSocials(updated);
          alert("Social link deleted successfully!");
        } else {
          const errorData = await res.json();
          alert(`Failed to delete social: ${errorData.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error deleting social:", error);
        alert("Error deleting social");
      }
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
            Social Media Links
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your social media links and profiles
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Add Social Link
          </button>
          <button
            onClick={saveAllData}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "💾 Save All"}
          </button>
        </div>
      </div>

      {/* Add Social Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Add Social Link
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newSocial.title}
                    onChange={(e) =>
                      setNewSocial({ ...newSocial, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Instagram, TikTok, Email"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newSocial.link}
                    onChange={(e) =>
                      setNewSocial({ ...newSocial, link: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeModal}
                  disabled={savingNew}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNewSocial}
                  disabled={savingNew}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {savingNew ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
  );
};

export default SocialsPage;


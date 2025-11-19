import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminLayout from "../../../components/AdminLayout";
import { v4 as uuidv4 } from "uuid";

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

const PortfolioEditPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const isNew = id === "new";

  const [portfolioItem, setPortfolioItem] = useState<PortfolioItem>({
    id: "",
    title: "",
    slug: "",
    summary: "",
    images: [],
    techStack: [],
    contributions: [],
    features: [],
    featured: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageInput, setImageInput] = useState("");

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      router.push("/");
      return;
    }

    if (isNew) {
      setPortfolioItem({
        id: uuidv4(),
        title: "",
        slug: "",
        summary: "",
        images: [],
        techStack: [],
        contributions: [],
        features: [],
        featured: false,
      });
      setLoading(false);
    } else if (id) {
      fetchPortfolioItem();
    }
  }, [id, router]);

  const fetchPortfolioItem = async () => {
    try {
      const res = await fetch("/api/portfolio?admin=true");
      if (res.ok) {
        const data = await res.json();
        const item = (data.portfolioItems || []).find(
          (p: PortfolioItem) => p.id === id
        );
        if (item) {
          setPortfolioItem(item);
        } else {
          alert("Portfolio item not found");
          router.push("/admin/portfolio");
        }
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePortfolio = async () => {
    if (!portfolioItem.title || !portfolioItem.slug) {
      alert("Please fill in title and slug");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/portfolio?admin=true");
      if (res.ok) {
        const data = await res.json();
        let items = data.portfolioItems || [];

        if (isNew) {
          items.push(portfolioItem);
        } else {
          items = items.map((item: PortfolioItem) =>
            item.id === portfolioItem.id ? portfolioItem : item
          );
        }

        const updatedData = { ...data, portfolioItems: items };
        const saveRes = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });

        if (saveRes.ok) {
          alert("Portfolio saved successfully!");
          router.push("/admin/portfolio");
        } else {
          alert("Failed to save portfolio");
        }
      }
    } catch (error) {
      console.error("Error saving portfolio:", error);
      alert("Error saving portfolio");
    } finally {
      setSaving(false);
    }
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setPortfolioItem({
        ...portfolioItem,
        images: [...portfolioItem.images, imageInput.trim()],
      });
      setImageInput("");
    }
  };

  const removeImage = (index: number) => {
    const newImages = portfolioItem.images.filter((_, i) => i !== index);
    setPortfolioItem({ ...portfolioItem, images: newImages });
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...portfolioItem.images];
    if (direction === "up" && index > 0) {
      [newImages[index - 1], newImages[index]] = [
        newImages[index],
        newImages[index - 1],
      ];
    } else if (direction === "down" && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ];
    }
    setPortfolioItem({ ...portfolioItem, images: newImages });
  };

  const updateArrayField = (
    field: "techStack" | "contributions" | "features",
    value: string
  ) => {
    setPortfolioItem({
      ...portfolioItem,
      [field]: value.split(",").map((s) => s.trim()).filter(Boolean),
    });
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin/portfolio">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <svg
                  className="w-6 h-6 text-gray-600 dark:text-gray-400"
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
              </button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {isNew ? "Create New Portfolio" : "Edit Portfolio"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isNew
                  ? "Add a new portfolio item to showcase your work"
                  : "Update portfolio item details and images"}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/portfolio">
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  Cancel
                </button>
              </Link>
              <button
                onClick={savePortfolio}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "💾 Save Portfolio"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  Basic Information
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={portfolioItem.title}
                    onChange={(e) =>
                      setPortfolioItem({ ...portfolioItem, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter portfolio title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={portfolioItem.slug}
                    onChange={(e) =>
                      setPortfolioItem({ ...portfolioItem, slug: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
                    placeholder="portfolio-slug"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    URL-friendly identifier (e.g., "my-awesome-project")
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Summary
                  </label>
                  <textarea
                    value={portfolioItem.summary || ""}
                    onChange={(e) =>
                      setPortfolioItem({ ...portfolioItem, summary: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Brief description of this portfolio item..."
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {portfolioItem.summary?.length || 0} characters
                  </p>
                </div>
              </div>
            </div>

            {/* Images Management Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-2xl">🖼️</span>
                  Images Gallery
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Add and manage images for this portfolio
                </p>
              </div>
              <div className="p-6 space-y-5">
                {/* Add Image Input */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      placeholder="/images/portfolio-image.jpg"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addImage();
                        }
                      }}
                    />
                    <button
                      onClick={addImage}
                      disabled={!imageInput.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
                    >
                      Add Image
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Enter image URL and press Enter or click Add Image
                  </p>
                </div>

                {/* Images Grid */}
                {portfolioItem.images.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {portfolioItem.images.map((image, index) => (
                      <div
                        key={index}
                        className="group relative bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all"
                      >
                        <div className="flex gap-4">
                          {/* Image Preview */}
                          <div className="relative w-32 h-32 flex-shrink-0 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`Image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23ddd' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              #{index + 1}
                            </div>
                          </div>

                          {/* Image Info & Controls */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-2 truncate">
                              {image}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => moveImage(index, "up")}
                                disabled={index === 0}
                                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-1"
                                title="Move up"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 15l7-7 7 7"
                                  />
                                </svg>
                                Up
                              </button>
                              <button
                                onClick={() => moveImage(index, "down")}
                                disabled={index === portfolioItem.images.length - 1}
                                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-1"
                                title="Move down"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                                Down
                              </button>
                              <button
                                onClick={() => removeImage(index)}
                                className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium flex items-center gap-1"
                                title="Remove image"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      No images added yet
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Add your first image above
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-2xl">🏷️</span>
                  Additional Information
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tech Stack
                  </label>
                  <input
                    type="text"
                    value={(portfolioItem.techStack || []).join(", ")}
                    onChange={(e) => updateArrayField("techStack", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="React, Next.js, TypeScript (comma-separated)"
                  />
                  {portfolioItem.techStack && portfolioItem.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {portfolioItem.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Contributions
                  </label>
                  <input
                    type="text"
                    value={(portfolioItem.contributions || []).join(", ")}
                    onChange={(e) =>
                      updateArrayField("contributions", e.target.value)
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Design, Development, Photography (comma-separated)"
                  />
                  {portfolioItem.contributions &&
                    portfolioItem.contributions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {portfolioItem.contributions.map((cont, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium"
                          >
                            {cont}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Features
                  </label>
                  <input
                    type="text"
                    value={(portfolioItem.features || []).join(", ")}
                    onChange={(e) => updateArrayField("features", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Responsive Design, Dark Mode, SEO (comma-separated)"
                  />
                  {portfolioItem.features && portfolioItem.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {portfolioItem.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Featured Toggle Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  Settings
                </h3>
              </div>
              <div className="p-6">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={portfolioItem.featured || false}
                      onChange={(e) =>
                        setPortfolioItem({
                          ...portfolioItem,
                          featured: e.target.checked,
                        })
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-14 h-8 rounded-full transition-colors ${
                        portfolioItem.featured
                          ? "bg-yellow-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform mt-1 ${
                          portfolioItem.featured
                            ? "translate-x-7"
                            : "translate-x-1"
                        }`}
                      ></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-900 dark:text-white font-medium">
                      Mark as Featured
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Featured portfolios appear in the featured section
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-xl">👁️</span>
                  Preview
                </h3>
              </div>
              <div className="p-6">
                {portfolioItem.images.length > 0 ? (
                  <div className="space-y-4">
                    <div className="relative w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={portfolioItem.images[0]}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      {portfolioItem.featured && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                          <span>⭐</span>
                          Featured
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {portfolioItem.title || "Untitled Portfolio"}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {portfolioItem.summary || "No description"}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">
                          {portfolioItem.images.length}
                        </span>{" "}
                        image{portfolioItem.images.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No preview available
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Quick Stats
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Images
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {portfolioItem.images.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tech Stack
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {portfolioItem.techStack?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Contributions
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {portfolioItem.contributions?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Features
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {portfolioItem.features?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PortfolioEditPage;

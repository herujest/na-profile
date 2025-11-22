"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { uploadImage } from "@/lib/upload";

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  images: string[];
  tags?: string[];
  categories?: string[];
  brands?: string[];
  featured?: boolean;
}

interface PortfolioEditPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

const PortfolioEditPage: React.FC<PortfolioEditPageProps> = ({ params }) => {
  const router = useRouter();
  const routeParams = useParams();
  const [slug, setSlug] = useState<string>("");
  const isNew = slug === "new";

  // Resolve params Promise or use directly
  useEffect(() => {
    const getSlug = async () => {
      if (params && typeof params === 'object' && 'then' in params && typeof params.then === 'function') {
        // params is a Promise
        const resolved = await (params as Promise<{ slug: string }>);
        setSlug(resolved.slug);
      } else if (params && 'slug' in params) {
        // params is already resolved
        setSlug((params as { slug: string }).slug);
      } else if (routeParams?.slug) {
        // Fallback to useParams hook
        setSlug(routeParams.slug as string);
      }
    };
    getSlug();
  }, [params, routeParams]);

  const [portfolioItem, setPortfolioItem] = useState<PortfolioItem>({
    id: "",
    title: "",
    slug: "",
    summary: "",
    images: [],
    tags: [],
    categories: [],
    brands: [],
    featured: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageInput, setImageInput] = useState("");
  const [uploading, setUploading] = useState(false);
  // Store pending images (files) locally before upload
  const [pendingImages, setPendingImages] = useState<
    Array<{ file: File; preview: string }>
  >([]);
  // Store raw input values for array fields (to allow typing without immediate parsing)
  const [tagsInput, setTagsInput] = useState("");
  const [categoriesInput, setCategoriesInput] = useState("");
  const [brandsInput, setBrandsInput] = useState("");
  // Preview carousel state
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [isPreviewHovered, setIsPreviewHovered] = useState(false);

  useEffect(() => {
    if (!slug) return; // Wait for params to resolve

    if (isNew) {
      setPortfolioItem({
        id: uuidv4(),
        title: "",
        slug: "", // Will be auto-generated on save
        summary: "",
        images: [],
        tags: [],
        categories: [],
        brands: [],
        featured: false,
      });
      setTagsInput("");
      setCategoriesInput("");
      setBrandsInput("");
      setLoading(false);
    } else {
      fetchPortfolioItem();
    }

    // Cleanup: revoke object URLs when component unmounts
    return () => {
      // Cleanup will be handled in removePendingImage and savePortfolio
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Get all images for preview (existing + pending)
  const allPreviewImages = useMemo(
    () => [...portfolioItem.images, ...pendingImages.map((img) => img.preview)],
    [portfolioItem.images, pendingImages]
  );

  // Autoplay carousel for preview
  useEffect(() => {
    if (allPreviewImages.length <= 1) return;

    const startAutoplay = () => {
      const interval = setInterval(() => {
        setPreviewImageIndex((prev) => (prev + 1) % allPreviewImages.length);
      }, 2500); // 2.5 second interval

      return interval;
    };

    // Pause autoplay when hovered or tab inactive
    if (!isPreviewHovered && document.visibilityState === "visible") {
      const interval = startAutoplay();
      return () => clearInterval(interval);
    }
  }, [allPreviewImages.length, isPreviewHovered]);

  // Reset preview index when images change
  useEffect(() => {
    setPreviewImageIndex(0);
  }, [allPreviewImages.length]);

  const fetchPortfolioItem = async () => {
    try {
      const res = await fetch(`/api/portfolio/${slug}`);
      if (res.ok) {
        const item = await res.json();
        setPortfolioItem(item);
        // Initialize input values from array fields
        setTagsInput((item.tags || []).join(", "));
        setCategoriesInput((item.categories || []).join(", "));
        setBrandsInput((item.brands || []).join(", "));
      } else {
        alert("Portfolio item not found");
        router.push("/admin/portfolio");
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      alert("Error fetching portfolio");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (files: File[]) => {
    // Create preview URLs for all files and add them to pending images
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    // Use functional update to ensure we get the latest state
    setPendingImages((prev) => [...prev, ...newImages]);
  };

  const removePendingImage = (index: number) => {
    const image = pendingImages[index];
    // Revoke object URL to free memory
    URL.revokeObjectURL(image.preview);
    setPendingImages(pendingImages.filter((_, i) => i !== index));
  };

  const movePendingImage = (index: number, direction: "up" | "down") => {
    const newPendingImages = [...pendingImages];
    if (direction === "up" && index > 0) {
      [newPendingImages[index - 1], newPendingImages[index]] = [
        newPendingImages[index],
        newPendingImages[index - 1],
      ];
    } else if (direction === "down" && index < newPendingImages.length - 1) {
      [newPendingImages[index], newPendingImages[index + 1]] = [
        newPendingImages[index + 1],
        newPendingImages[index],
      ];
    }
    setPendingImages(newPendingImages);
  };

  const uploadImagesToR2 = async (
    slug: string,
    files: File[]
  ): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        const { publicUrl } = await uploadImage(file, slug);
        if (publicUrl) {
          uploadedUrls.push(publicUrl);
        }
      } catch (error: any) {
        console.error("Error uploading image:", error);
        alert(`Failed to upload ${file.name}: ${error.message}`);
      }
    }

    return uploadedUrls;
  };

  const savePortfolio = async () => {
    const requestId = `[${Date.now()}]`;
    console.log(`${requestId} [FRONTEND] Starting save portfolio...`, {
      isNew,
      portfolioItem: {
        title: portfolioItem.title,
        imagesCount: portfolioItem.images.length,
        tagsCount: portfolioItem.tags?.length || 0,
        categoriesCount: portfolioItem.categories?.length || 0,
        brandsCount: portfolioItem.brands?.length || 0,
        featured: portfolioItem.featured,
      },
      pendingImagesCount: pendingImages.length,
    });

    if (!portfolioItem.title) {
      console.warn(
        `${requestId} [FRONTEND] Validation failed: Title is required`
      );
      alert("Please fill in title");
      return;
    }

    setSaving(true);
    setUploading(true);
    try {
      let savedItem;
      let finalSlug: string;

      if (isNew) {
        // NEW FLOW: Upload images first, then create portfolio with image URLs

        // Step 1: Generate slug first
        console.log(`${requestId} [FRONTEND] Step 1: Generating slug...`);
        const slugRes = await fetch("/api/portfolio/generate-slug", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        console.log("slugres", slugRes);

        if (!slugRes.ok) {
          let errorMessage = "Failed to generate slug";
          try {
            const contentType = slugRes.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const error = await slugRes.json();
              errorMessage = error.error || error.details || errorMessage;
            } else {
              const text = await slugRes.text();
              console.error(
                `${requestId} [FRONTEND] Non-JSON error response:`,
                text.substring(0, 500)
              );
              errorMessage = `Server error: ${slugRes.status} ${slugRes.statusText}`;
            }
          } catch (e) {
            errorMessage = `Server error: ${slugRes.status} ${slugRes.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const slugData = await slugRes.json();
        finalSlug = slugData.slug;
        console.log(`${requestId} [FRONTEND] ✅ Slug generated: ${finalSlug}`);

        // Step 2: Upload pending images to R2 (if any)
        let uploadedImageUrls: string[] = [];
        if (pendingImages.length > 0) {
          console.log(
            `${requestId} [FRONTEND] Step 2: Uploading ${pendingImages.length} image(s) to portfolio: ${finalSlug}`
          );
          uploadedImageUrls = await uploadImagesToR2(
            finalSlug,
            pendingImages.map((img) => img.file)
          );
          console.log(
            `${requestId} [FRONTEND] ✅ Images uploaded:`,
            uploadedImageUrls
          );
        }

        // Step 3: Combine existing images (from URL input) with uploaded images
        const existingImages = Array.isArray(portfolioItem.images)
          ? portfolioItem.images
          : [];
        const allImages = [...existingImages, ...uploadedImageUrls];

        // Step 4: Create portfolio with slug and all image URLs
        const { slug: _, ...itemWithoutSlug } = portfolioItem;
        const portfolioData = {
          ...itemWithoutSlug,
          slug: finalSlug,
          images: allImages,
        };

        console.log(`${requestId} [FRONTEND] Step 3: Creating portfolio...`, {
          slug: finalSlug,
          imagesCount: allImages.length,
        });

        const createRes = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(portfolioData),
        });

        if (!createRes.ok) {
          let errorMessage = "Failed to create portfolio";
          try {
            const errorData = await createRes.json();
            errorMessage = errorData.error || errorData.details || errorMessage;
          } catch {
            errorMessage = `Server error: ${createRes.status} ${createRes.statusText}`;
          }
          throw new Error(errorMessage);
        }

        savedItem = await createRes.json();
        console.log(
          `${requestId} [FRONTEND] ✅ Portfolio created successfully:`,
          {
            id: savedItem?.id,
            slug: savedItem?.slug,
            title: savedItem?.title,
            imagesCount: savedItem?.images?.length || 0,
          }
        );

        // Clean up preview URLs
        if (pendingImages.length > 0) {
          pendingImages.forEach((img) => URL.revokeObjectURL(img.preview));
          setPendingImages([]);
        }
      } else {
        // UPDATE FLOW: Upload new images first, then update portfolio

        finalSlug = slug;

        // Step 1: Upload pending images to R2 (if any)
        let uploadedImageUrls: string[] = [];
        if (pendingImages.length > 0) {
          console.log(
            `${requestId} [FRONTEND] Uploading ${pendingImages.length} image(s) to portfolio: ${finalSlug}`
          );
          uploadedImageUrls = await uploadImagesToR2(
            finalSlug,
            pendingImages.map((img) => img.file)
          );
          console.log(
            `${requestId} [FRONTEND] ✅ Images uploaded:`,
            uploadedImageUrls
          );
        }

        // Step 2: Update portfolio with new image URLs
        const { slug: _, ...itemWithoutSlug } = portfolioItem;
        const existingImages = Array.isArray(portfolioItem.images)
          ? portfolioItem.images
          : [];
        const allImages = [...existingImages, ...uploadedImageUrls];

        const updateData = {
          ...itemWithoutSlug,
          images: allImages,
        };

        const updateRes = await fetch(`/api/portfolio/${finalSlug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });

        if (!updateRes.ok) {
          const error = await updateRes.json();
          throw new Error(error.error || "Failed to update portfolio");
        }

        savedItem = await updateRes.json();

        // Clean up preview URLs
        if (pendingImages.length > 0) {
          pendingImages.forEach((img) => URL.revokeObjectURL(img.preview));
          setPendingImages([]);
        }
      }

      alert("Portfolio saved successfully!");
      if (isNew) {
        // Redirect to edit page with the new slug
        router.push(`/admin/portfolio/${savedItem.slug}`);
      } else {
        router.push("/admin/portfolio");
      }
    } catch (error: any) {
      console.error(`${requestId} [FRONTEND] ❌ Error saving portfolio:`, {
        name: error?.name,
        message: error?.message,
        stack: error?.stack?.split("\n").slice(0, 5).join("\n"),
      });
      alert(error.message || "Error saving portfolio");
    } finally {
      console.log(`${requestId} [FRONTEND] Save operation completed`);
      setSaving(false);
      setUploading(false);
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
    field: "tags" | "categories" | "brands",
    value: string
  ) => {
    // Parse comma-separated values into array
    const arrayValue = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setPortfolioItem({
      ...portfolioItem,
      [field]: arrayValue,
    });
  };

  const handleArrayFieldBlur = (
    field: "tags" | "categories" | "brands",
    inputValue: string
  ) => {
    // Update the array field when user finishes typing (on blur)
    updateArrayField(field, inputValue);
  };

  const handleArrayFieldKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "tags" | "categories" | "brands",
    inputValue: string
  ) => {
    // Update the array field when user presses Enter
    if (e.key === "Enter") {
      e.preventDefault();
      updateArrayField(field, inputValue);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
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
              disabled={saving || uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {saving || uploading ? (
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
                  {uploading ? "Uploading images..." : "Saving..."}
                </span>
              ) : pendingImages.length > 0 ? (
                `💾 Save Portfolio (${pendingImages.length} image${
                  pendingImages.length > 1 ? "s" : ""
                } to upload)`
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
                      setPortfolioItem({
                        ...portfolioItem,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter portfolio title"
                    required
                  />
                </div>
                {!isNew && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Slug (Auto-generated, cannot be changed)
                    </label>
                    <input
                      type="text"
                      value={portfolioItem.slug}
                      readOnly
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-mono text-sm cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Slug is automatically generated and cannot be edited
                    </p>
                  </div>
                )}
                {isNew && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Note:</strong> Slug will be automatically
                      generated when you save this portfolio item.
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Summary
                  </label>
                  <textarea
                    value={portfolioItem.summary || ""}
                    onChange={(e) =>
                      setPortfolioItem({
                        ...portfolioItem,
                        summary: e.target.value,
                      })
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
                {/* Select Image (stored locally, uploaded on save) */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <label
                    htmlFor="image-upload-input"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Select Images (Multiple selection supported)
                  </label>
                  <input
                    id="image-upload-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        // Process all files at once
                        handleImageSelect(files);
                        // Reset input to allow selecting the same files again if needed
                        e.target.value = "";
                      }
                    }}
                    disabled={saving || uploading}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      dark:file:bg-blue-900/30 dark:file:text-blue-300
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {pendingImages.length > 0 && (
                    <p className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                      ✓ {pendingImages.length} image(s) ready to upload on save
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    You can select multiple images at once. Images will be
                    uploaded to R2 when you save:
                    portfolio/[slug]/image-name.jpg
                  </p>
                </div>

                {/* Add Image URL Input */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      placeholder="https://example.com/image.jpg or /images/image.jpg"
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
                      Add URL
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Or enter image URL manually
                  </p>
                </div>

                {/* Pending Images (not yet uploaded) */}
                {pendingImages.length > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center gap-2">
                      <span>⏳</span>
                      Pending Images ({pendingImages.length}) - Will be uploaded
                      on save
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {pendingImages.map((pendingImg, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 border border-yellow-300 dark:border-yellow-700"
                        >
                          <div className="relative w-20 h-20 flex-shrink-0 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden">
                            <img
                              src={pendingImg.preview}
                              alt={`Pending ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {pendingImg.file.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(pendingImg.file.size / 1024 / 1024).toFixed(2)}{" "}
                              MB
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => movePendingImage(index, "up")}
                              disabled={index === 0}
                              className="px-2 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
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
                            </button>
                            <button
                              onClick={() => movePendingImage(index, "down")}
                              disabled={index === pendingImages.length - 1}
                              className="px-2 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
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
                            </button>
                            <button
                              onClick={() => removePendingImage(index)}
                              className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
                              title="Remove"
                            >
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images Grid (Already uploaded) */}
                {portfolioItem.images.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Uploaded Images ({portfolioItem.images.length})
                    </h3>
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
                                  disabled={
                                    index === portfolioItem.images.length - 1
                                  }
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
                  </div>
                )}

                {/* Empty State */}
                {portfolioItem.images.length === 0 &&
                  pendingImages.length === 0 && (
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
                    Tags / Keywords
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    onBlur={(e) => handleArrayFieldBlur("tags", e.target.value)}
                    onKeyPress={(e) =>
                      handleArrayFieldKeyPress(e, "tags", tagsInput)
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="price friendly, easy location, best recommendation mua, etc. (comma-separated)"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Type tags/keywords separated by commas, then press Enter or
                    click outside to save
                  </p>
                  {portfolioItem.tags && portfolioItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {portfolioItem.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Categories
                  </label>
                  <input
                    type="text"
                    value={categoriesInput}
                    onChange={(e) => setCategoriesInput(e.target.value)}
                    onBlur={(e) =>
                      handleArrayFieldBlur("categories", e.target.value)
                    }
                    onKeyPress={(e) =>
                      handleArrayFieldKeyPress(
                        e,
                        "categories",
                        categoriesInput
                      )
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Fashion, Beauty, Commercial, Editorial, etc. (comma-separated)"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Type categories separated by commas, then press Enter or
                    click outside to save
                  </p>
                  {portfolioItem.categories &&
                    portfolioItem.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {portfolioItem.categories.map((category, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Brands / Clients
                  </label>
                  <input
                    type="text"
                    value={brandsInput}
                    onChange={(e) => setBrandsInput(e.target.value)}
                    onBlur={(e) =>
                      handleArrayFieldBlur("brands", e.target.value)
                    }
                    onKeyPress={(e) =>
                      handleArrayFieldKeyPress(e, "brands", brandsInput)
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Brand A, Brand B, Client Name, etc. (comma-separated)"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Type brand/client names separated by commas, then press
                    Enter or click outside to save
                  </p>
                  {portfolioItem.brands && portfolioItem.brands.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {portfolioItem.brands.map((brand, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium"
                        >
                          {brand}
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
                {allPreviewImages.length > 0 ? (
                  <div className="space-y-4">
                    <div
                      className="relative w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden"
                      onMouseEnter={() => setIsPreviewHovered(true)}
                      onMouseLeave={() => setIsPreviewHovered(false)}
                    >
                      {allPreviewImages.map((imageSrc, index) => {
                        const isActive = index === previewImageIndex;
                        return (
                          <div
                            key={index}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
                              isActive ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            <img
                              src={imageSrc}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
                            />
                          </div>
                        );
                      })}
                      {portfolioItem.featured && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 z-10">
                          <span>⭐</span>
                          Featured
                        </div>
                      )}
                      {allPreviewImages.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
                          {allPreviewImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setPreviewImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === previewImageIndex
                                  ? "bg-white w-6"
                                  : "bg-white/50 hover:bg-white/75"
                              }`}
                              aria-label={`Go to image ${index + 1}`}
                            />
                          ))}
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
                          {allPreviewImages.length}
                        </span>{" "}
                        image{allPreviewImages.length !== 1 ? "s" : ""}
                        {pendingImages.length > 0 && (
                          <span className="ml-2 text-yellow-600 dark:text-yellow-400">
                            ({pendingImages.length} pending)
                          </span>
                        )}
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
                    Tags
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {portfolioItem.tags?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Categories
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {portfolioItem.categories?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Brands
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {portfolioItem.brands?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default PortfolioEditPage;


"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

interface Experience {
  id: string;
  dates: string;
  type: string;
  position: string;
  bullets: string | string[];
}

interface Education {
  universityName: string;
  universityDate: string;
  universityPara: string;
}

interface Resume {
  tagline: string;
  description: string;
  experiences: Experience[];
  education: Education;
  languages: string[];
  frameworks: string[];
  others: string[];
}

const ResumePage: React.FC = () => {
  const router = useRouter();
  const [resume, setResume] = useState<Resume>({
    tagline: "",
    description: "",
    experiences: [],
    education: {
      universityName: "",
      universityDate: "",
      universityPara: "",
    },
    languages: [],
    frameworks: [],
    others: [],
  });
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
        setResume(data.resume || resume);
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
        const updatedData = { ...data, resume };
        const saveRes = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });

        if (saveRes.ok) {
          alert("Resume saved successfully!");
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

  const updateResume = (field: string, value: any) => {
    setResume({ ...resume, [field]: value });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: uuidv4(),
      dates: "",
      type: "",
      position: "",
      bullets: "",
    };
    updateResume("experiences", [...resume.experiences, newExp]);
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const experiences = [...resume.experiences];
    experiences[index] = { ...experiences[index], [field]: value };
    updateResume("experiences", experiences);
  };

  const deleteExperience = (index: number) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      const experiences = resume.experiences.filter((_, i) => i !== index);
      updateResume("experiences", experiences);
    }
  };

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Resume Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your resume information and experiences
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

      <div className="space-y-6">
        {/* Main Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Main Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={resume.tagline || ""}
                onChange={(e) => updateResume("tagline", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={resume.description || ""}
                onChange={(e) => updateResume("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Experiences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Experiences
            </h2>
            <button
              onClick={addExperience}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Add Experience
            </button>
          </div>
          <div className="space-y-4">
            {resume.experiences.map((exp, index) => (
              <div
                key={exp.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {exp.position || `Experience ${index + 1}`}
                  </h3>
                  <button
                    onClick={() => deleteExperience(index)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dates
                    </label>
                    <input
                      type="text"
                      value={exp.dates || ""}
                      onChange={(e) =>
                        updateExperience(index, "dates", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <input
                      type="text"
                      value={exp.type || ""}
                      onChange={(e) =>
                        updateExperience(index, "type", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      value={exp.position || ""}
                      onChange={(e) =>
                        updateExperience(index, "position", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bullets (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={
                        typeof exp.bullets === "string"
                          ? exp.bullets
                          : Array.isArray(exp.bullets)
                          ? exp.bullets.join(", ")
                          : ""
                      }
                      onChange={(e) =>
                        updateExperience(index, "bullets", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
            {resume.experiences.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No experiences yet. Click "Add Experience" to get started.
              </p>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                University Name
              </label>
              <input
                type="text"
                value={resume.education?.universityName || ""}
                onChange={(e) =>
                  updateResume("education", {
                    ...resume.education,
                    universityName: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="text"
                value={resume.education?.universityDate || ""}
                onChange={(e) =>
                  updateResume("education", {
                    ...resume.education,
                    universityDate: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={resume.education?.universityPara || ""}
                onChange={(e) =>
                  updateResume("education", {
                    ...resume.education,
                    universityPara: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Languages (comma-separated)
              </label>
              <input
                type="text"
                value={(resume.languages || []).join(", ")}
                onChange={(e) =>
                  updateResume(
                    "languages",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frameworks (comma-separated)
              </label>
              <input
                type="text"
                value={(resume.frameworks || []).join(", ")}
                onChange={(e) =>
                  updateResume(
                    "frameworks",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Others (comma-separated)
              </label>
              <input
                type="text"
                value={(resume.others || []).join(", ")}
                onChange={(e) =>
                  updateResume(
                    "others",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;


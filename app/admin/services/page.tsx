"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { v4 as uuidv4 } from "uuid";

interface Service {
  id: string;
  title: string;
  description: string;
}

const ServicesPage: React.FC = () => {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
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
        setServices(data.services || []);
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
        const updatedData = { ...data, services };
        const saveRes = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });

        if (saveRes.ok) {
          alert("Services saved successfully!");
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

  const addService = () => {
    const newService = {
      id: uuidv4(),
      title: "New Service",
      description: "",
    };
    setServices([...services, newService]);
  };

  const updateService = (index: number, field: string, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const deleteService = (index: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const updated = services.filter((_, i) => i !== index);
      setServices(updated);
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
              Services Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your services and descriptions
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={addService}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Add Service
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

        <div className="space-y-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {service.title || `Service ${index + 1}`}
                </h3>
                <button
                  onClick={() => deleteService(index)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={service.title || ""}
                    onChange={(e) =>
                      updateService(index, "title", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={service.description || ""}
                    onChange={(e) =>
                      updateService(index, "description", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No services yet. Click "Add Service" to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ServicesPage;


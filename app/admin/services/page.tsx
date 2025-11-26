"use client";

export const dynamic = 'error';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/services");
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

  const saveService = async (service: Service, index: number) => {
    try {
      if (service.id && service.id.startsWith("temp-")) {
        // New service - create it
        const res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: service.title,
            description: service.description,
            order: index,
          }),
        });

        if (res.ok) {
          const newService = await res.json();
          // Update local state with the new service ID
          const updated = [...services];
          updated[index] = newService;
          setServices(updated);
          return true;
        } else {
          const errorData = await res.json();
          alert(`Failed to create service: ${errorData.error || "Unknown error"}`);
          return false;
        }
      } else {
        // Existing service - update it
        const res = await fetch(`/api/services/${service.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: service.title,
            description: service.description,
            order: index,
          }),
        });

        if (res.ok) {
          return true;
        } else {
          const errorData = await res.json();
          alert(`Failed to update service: ${errorData.error || "Unknown error"}`);
          return false;
        }
      }
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Error saving service");
      return false;
    }
  };

  const saveAllData = async () => {
    setSaving(true);
    try {
      // Save all services
      const savePromises = services.map((service, index) =>
        saveService(service, index)
      );
      const results = await Promise.all(savePromises);

      if (results.every((r) => r === true)) {
        alert("All services saved successfully!");
        // Refresh data to get updated IDs
        await fetchData();
      } else {
        alert("Some services failed to save. Please check and try again.");
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
      id: `temp-${uuidv4()}`, // Temporary ID for new services
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

  const deleteService = async (index: number) => {
    const service = services[index];
    if (!service) return;

    if (confirm("Are you sure you want to delete this service?")) {
      // If it's a temporary service (not saved yet), just remove from state
      if (service.id.startsWith("temp-")) {
        const updated = services.filter((_, i) => i !== index);
        setServices(updated);
        return;
      }

      // Otherwise, delete from API
      try {
        const res = await fetch(`/api/services/${service.id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          const updated = services.filter((_, i) => i !== index);
          setServices(updated);
          alert("Service deleted successfully!");
        } else {
          const errorData = await res.json();
          alert(`Failed to delete service: ${errorData.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Error deleting service");
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
            onClick={saveAllData}
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
  );
};

export default ServicesPage;


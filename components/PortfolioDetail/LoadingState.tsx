"use client";

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Loading portfolio...
        </p>
      </div>
    </div>
  );
}


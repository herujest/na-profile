"use client";

import { Button } from "@/components/atoms";

interface ErrorStateProps {
  error?: string | null;
  onBack?: () => void;
  backHref?: string;
}

export default function ErrorState({
  error,
  onBack,
  backHref = "/portfolio",
}: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {error || "Portfolio Not Found"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The portfolio item you're looking for doesn't exist or has been
          removed.
        </p>
        {onBack ? (
          <Button onClick={onBack} variant="primary" size="md">
            Back to Portfolio
          </Button>
        ) : (
          <Button href={backHref} variant="primary" size="md">
            Back to Portfolio
          </Button>
        )}
      </div>
    </div>
  );
}


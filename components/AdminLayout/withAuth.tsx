"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated) {
            setAuthenticated(true);
          } else {
            router.replace("/admin/login");
          }
        })
        .catch(() => {
          router.replace("/admin/login");
        })
        .finally(() => {
          setLoading(false);
        });
    }, [router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      );
    }

    if (!authenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}


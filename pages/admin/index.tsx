import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const AdminIndex: React.FC = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check authentication status
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/admin/login");
        }
      })
      .catch(() => {
        router.replace("/admin/login");
      })
      .finally(() => {
        setChecking(false);
      });
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AdminIndex;

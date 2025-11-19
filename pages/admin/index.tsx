import { useEffect } from "react";
import { useRouter } from "next/router";

const AdminIndex: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return null;
};

export default AdminIndex;

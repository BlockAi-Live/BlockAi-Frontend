import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // You might want a loading spinner here
    return <div className="min-h-screen flex items-center justify-center bg-[#0B0E1A] text-white">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to signup as requested, preserving the intended destination
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex min-h-[55vh] items-center justify-center text-sm text-slate-500">Memeriksa sesi pengguna...</div>;
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}

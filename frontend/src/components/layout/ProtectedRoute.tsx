import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../ctx/AuthCtx";
import type { UserRole } from "../../lib/types";

type ProtectedRouteProps = {
    allowedRoles?: UserRole[];
};

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;

    if (!user) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
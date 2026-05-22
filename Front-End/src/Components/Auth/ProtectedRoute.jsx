import { Navigate, useLocation } from "react-router-dom";
import {
  getDefaultRouteForRole,
  getStoredRole,
  getToken,
  isRoleAllowed,
} from "../../utils/authStorage";

export default function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();
  const token = getToken();
  const role = getStoredRole();

  if (!token || !role) {
    return <Navigate to="/Login" replace state={{ from: location }} />;
  }

  if (!isRoleAllowed(role, allowedRoles)) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return children;
}

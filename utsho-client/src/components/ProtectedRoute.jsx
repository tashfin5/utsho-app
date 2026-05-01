import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = getToken();
  const user = getUser();

  // ❌ Not logged in
  if (!token || !user) {
    // ✅ ADDED 'replace' to prevent back-button loops
    return <Navigate to="/" replace />;
  }

  // ❌ Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // ✅ Send them back to THEIR dashboard if they try to use the back button into another role's page
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'teacher') return <Navigate to="/teacher-dashboard" replace />;
    if (user.role === 'student') return <Navigate to="/student-dashboard" replace />;
    
    // Fallback just in case
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
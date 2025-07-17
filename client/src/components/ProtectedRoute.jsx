
// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import UserAPI from "../api/UserAPI"; // Adjust path as needed

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  // Get token from localStorage
  const token = localStorage.getItem('accessToken');
  
  // Use your existing UserAPI hook
  const { 
    isLogged: [isLogged], 
    isAdmin: [isAdmin], 
    isLoadingUser 
  } = UserAPI(token);

  // Show loading spinner while checking auth
  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  // If admin access is required and user is not admin, redirect
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />; // Redirect to home or show unauthorized page
  }

  return children;
};

export default ProtectedRoute;
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If the user is not logged in, redirect to the login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children; // If logged in, allow access to the page
};

export default ProtectedRoute;

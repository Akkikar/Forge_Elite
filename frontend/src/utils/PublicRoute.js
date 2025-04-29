import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If the user is logged in, redirect them to the home page or dashboard
  if (token) {
    return <Navigate to="/home" />;
  }

  return children; // If not logged in, allow access to the page
};

export default PublicRoute;

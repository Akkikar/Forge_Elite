import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import TestPage from "./components/TestPage";
import Home from "./components/Home";
import Reference from "./components/Reference";
import ResumeScore from "./components/ResumeScore";  // Import the new component
import PublicRoute from "./utils/PublicRoute";
import ProtectedRoute from "./utils/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        
        {/* Protected Routes: Only accessible if logged in */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reference"
          element={
            <ProtectedRoute>
              <Reference />
            </ProtectedRoute>
          }
        />
        
        {/* Add Resume Score Route */}
        <Route
          path="/resume-score"
          element={
            <ProtectedRoute>
              <ResumeScore />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

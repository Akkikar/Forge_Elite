import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./services/Home.jsx";
import BrowseFreelancers from "./services/BrowseFreelancers.jsx";
import FindWork from "./services/FindWork.jsx";
import PostJob from "./services/PostJob.jsx";
import Login from "./services/Login.jsx"; // Import Login component
import Register from "./services/Register.jsx"; // Import Register component
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root ("/") to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/browse-freelancers" element={<BrowseFreelancers />} />
        <Route path="/find-work" element={<FindWork />} />
        <Route path="/post-job" element={<PostJob />} />
      </Routes>
    </Router>
  );
};

export default App;

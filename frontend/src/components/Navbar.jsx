import React, { useState } from "react";
import { Link } from "react-router-dom"; // To handle navigation
import "./Navbar.css";

const Navbar = ({ username }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <h2>Forge_Elite</h2>
      </div>
      <div className="nav-right">
        <div className="nav-links">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/resume-score" className="nav-link">Resume Score</Link>
        </div>
        <div className="profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
          <span>👤 Profile</span>
          {isProfileOpen && (
            <div className="profile-dropdown">
              {/* Display the username and the logout button */}
              <p>{username}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

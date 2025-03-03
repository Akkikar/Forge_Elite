import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState("guest"); // Default user type
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user type from local storage or context
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);

  const handleLogout = () => {
    // Clear user data and redirect to login page
    localStorage.removeItem("userType");
    setUserType("guest");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">ForgeElite</Link>

        {/* Toggle Menu (for mobile) */}
        <button 
          className="menu-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? "✖" : "☰"}
        </button>

        {/* Navbar Links */}
        <ul className={`nav-links ${isOpen ? "open" : ""}`}>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/browse-freelancers">Courses</Link></li>
          <li><Link to="/find-work">Projects</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>

          {/* User-Specific Options */}
          {userType === "student" && (
            <>
              <li><Link to="/my-courses">My Courses</Link></li>
              <li><Link to="/assignments">Assignments</Link></li>
            </>
          )}
          {userType === "freelancer" && (
            <>
              <li><Link to="/my-jobs">My Jobs</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
            </>
          )}

          {/* Authentication Links */}
          {userType === "guest" ? (
            <>
              <li><Link to="/login" className="login-btn">Log In</Link></li>
              <li><Link to="/register" className="register-btn">Sign Up</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/settings">Settings</Link></li>
              <li><button onClick={handleLogout} className="logout-btn">Log Out</button></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
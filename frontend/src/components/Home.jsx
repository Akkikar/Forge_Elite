import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./Home.css";

const Home = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Assuming you fetch the username from a backend or local storage
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:8000/api/user/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.name);
          setUsername(data.name); // Set the username when fetched
        })
        .catch((error) => console.error("Error fetching username:", error));
    }
  }, []);

  return (
    <div className="home-container">
      <Navbar username={username} /> {/* Pass username as prop */}
      <div className="home-content">
        <h1>Welcome to Forge_Elite</h1>
        <p>Your AI-powered career companion. Build your career here!</p>
      </div>
    </div>
  );
};

export default Home;

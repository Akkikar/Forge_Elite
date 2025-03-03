import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Navbar from './Navbar';

const API_URL = "http://localhost:8080"; // Spring Boot URL

const Home = () => {
    const [message, setMessage] = useState("Loading...");
    const navigate = useNavigate();

    useEffect(() => {
        const userLoggedIn = localStorage.getItem("authToken");
        if (!userLoggedIn) {
            navigate("/login"); // Redirect to login if not logged in
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/`);
                setMessage(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setMessage("Error fetching data");
            }
        };
        fetchData();
    }, [navigate]);

    return (
        <>
            <Navbar />
            <div className="home-container">
                <div className="overlay">
                    <h1>Welcome to ForgeElite</h1>
                    <h2>Learn and Build your Careers </h2>
                </div>
            </div>
        </>
    );
};

export default Home;
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './ResumeScore.css';

const ResumeScore = () => {
  const [role, setRole] = useState('');
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!role || !file) {
      setMessage('Please enter role and select resume.');
      return;
    }

    const formData = new FormData();
    formData.append('role', role);
    formData.append('resume', file);

    try {
      const res = await axios.post('http://localhost:5000/score-resume', formData);
      setScore(res.data.score);
      setMessage(res.data.suggestion);
    } catch (err) {
      console.error(err);
      setMessage('Error while scoring resume');
    }
  };

  return (
    <div className="score-container">
        <Navbar />
      <h2>Resume Score Checker</h2>
      <form onSubmit={handleUpload} className="score-form">
        <label>Role you are applying for:</label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Full Stack Developer"
        />

        <label>Upload your resume (PDF/DOCX):</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit">Get Resume Score</button>
      </form>

      {score !== null && (
        <div className="score-result">
          <h3>Your Resume Score: {score} / 100</h3>
          <p className={score >= 60 ? 'good' : 'bad'}>{message}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeScore;

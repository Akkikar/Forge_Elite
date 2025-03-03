import React from 'react';
import Navbar from './Navbar';
import './FindWork.css';

export default function FindWork() {
  return (
    <>
      <Navbar />
      <div className="findwork-container">
        <div className="findwork-title">Available Projects!!</div>
        <div className="projects-list">
          <p>Explore and apply for freelance projects.</p>
        </div>
      </div>
    </>
  );
}

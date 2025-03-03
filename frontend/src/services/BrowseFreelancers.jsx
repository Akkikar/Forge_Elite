import React from 'react';
import Navbar from './Navbar';
import './BrowseFreelancers.css';

export default function BrowseFreelancers() {
  return (
    <>
      <Navbar />
      <div className="browse-container">
        <div className="browse-title">Available Courses!!</div>
        <div className="course-list">
          <p>Browse and enroll in top-rated courses.</p>
        </div>
      </div>
    </>
  );
}

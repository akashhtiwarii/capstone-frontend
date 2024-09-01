import React from 'react';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  return (
    <div className="owner-dashboard">
      <h1>Owner's Dashboard</h1>
      <div className="dashboard-sections">
        <section className="dashboard-section">
          <h2>My Profile</h2>
        </section>
        <section className="dashboard-section">
          <h2>My Restaurant</h2>
        </section>
        <section className="dashboard-section">
          <h2>My Menu</h2>
        </section>
      </div>
    </div>
  );
};

export default OwnerDashboard;

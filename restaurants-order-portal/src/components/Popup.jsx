import React from 'react';
import '../styles/Popup.css';

const Popup = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="popup-overlay">
      <div className="popup">
        <p>{message}</p>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;

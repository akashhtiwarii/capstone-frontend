import React, { useState } from 'react';
import '../styles/ContactSupportPopup.css';

const ContactSupportPopup = ({ onClose, onSubmit, isSending }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      alert('Subject and message fields cannot be empty.');
      return;
    }
    onSubmit({ subject, message });
  };

  return (
    <div className="contact-support-popup">
      <h2>Contact Support</h2>
      <label>Subject:</label>
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Enter subject"
      />
      <label>Message:</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      <button onClick={handleSubmit} disabled={isSending}>
        {isSending ? 'Sending...' : 'Submit'}
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ContactSupportPopup;

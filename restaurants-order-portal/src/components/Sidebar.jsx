import React from 'react';

const Sidebar = ({ menuItems, currentView, setCurrentView, onContactSupport, onOwnerDashboardClick }) => (
  <div className="sidebar">
    <ul>
    {onOwnerDashboardClick && (
        <li onClick={onOwnerDashboardClick}>
          ← Back
        </li>
      )}
      {menuItems.map((item) => (
        <li
          key={item.view}
          className={currentView === item.view ? 'active' : ''}
          onClick={() => {
            setCurrentView(item.view);
            item.onClick();
          }}
        >
          {item.label}
        </li>
      ))}
      {onContactSupport && (
        <li onClick={onContactSupport}>
          Contact Support
        </li>
      )}
    </ul>
  </div>
);

export default Sidebar;

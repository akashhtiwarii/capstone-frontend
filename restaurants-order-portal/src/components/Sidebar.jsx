import React from 'react';

const Sidebar = ({ menuItems, currentView, setCurrentView }) => (
  <div className="sidebar">
    <ul>
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
    </ul>
  </div>
);

export default Sidebar;

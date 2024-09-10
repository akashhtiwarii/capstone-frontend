import React, { useState, useEffect } from 'react';
import { getUserOrders } from '../services/apiService';
import '../styles/UserOrderPage.css';

const UserOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userId = JSON.parse(storedUser).userId;

      const fetchOrders = async () => {
        try {
          const data = await getUserOrders(userId);
          setOrders(data);
          setFilteredOrders(data);
          setLoading(false);
        } catch (err) {
          setError(true);
          setLoading(false);
        }
      };

      fetchOrders();
    } else {
      setError(true);
      setLoading(false);
    }
  }, []);

  const handleFilterChange = (status) => {
    setFilter(status);
    if (status === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === status));
    }
  };

  return (
    <div className="user-order-page">
      <div className="filter-buttons">
        <button onClick={() => handleFilterChange('ALL')} className={filter === 'ALL' ? 'active' : ''}>All</button>
        <button onClick={() => handleFilterChange('PENDING')} className={filter === 'PENDING' ? 'active' : ''}>Pending</button>
        <button onClick={() => handleFilterChange('ONGOING')} className={filter === 'ONGOING' ? 'active' : ''}>Ongoing</button>
        <button onClick={() => handleFilterChange('COMPLETED')} className={filter === 'COMPLETED' ? 'active' : ''}>Completed</button>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p>There was an error loading the orders.</p>
      ) : filteredOrders.length === 0 ? (
        <p>No orders found for the selected filter.</p>
      ) : (
        <div className="order-list">
          {filteredOrders.map((order, index) => (
            <div key={index} className="order-card">
              <h2>{order.restaurantName}</h2>
              <p><strong>Status: {order.status}</strong></p>
              <div className="food-items">
                {order.foodItemOutDTOS.map((foodItem, idx) => (
                  <div key={idx} className="food-item">
                    <p><strong>{foodItem.name}</strong></p>
                    <p>Quantity: {foodItem.quantity}</p>
                    <p>Price: ₹{foodItem.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrderPage;

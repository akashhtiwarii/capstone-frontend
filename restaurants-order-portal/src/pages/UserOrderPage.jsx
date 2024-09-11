import React, { useState, useEffect } from 'react';
import { getUserOrders, cancelOrder } from '../services/apiService'; 
import Popup from '../components/Popup';
import '../styles/UserOrderPage.css';

const UserOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [filter, setFilter] = useState('ALL');
  const [timers, setTimers] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userId = JSON.parse(storedUser).userId;

      const fetchOrders = async () => {
        try {
          const data = await getUserOrders(userId);

          // Initialize timers for orders that can still be cancelled
          const initialTimers = {};
          data.forEach(order => {
            if (order.status === 'PENDING') {
              const orderTime = new Date(order.orderTime);
              const currentTime = new Date();
              const timeElapsed = (currentTime - orderTime) / 1000; // Time elapsed in seconds
              const timeRemaining = 30 - timeElapsed; // Time remaining to cancel

              if (timeRemaining > 0) {
                initialTimers[order.orderId] = {
                  timeRemaining: Math.floor(timeRemaining),
                  intervalId: null,
                };
              }
            }
          });

          setOrders(data);
          setFilteredOrders(data);
          setTimers(initialTimers);
          setLoading(false);
        } catch (err) {
          setError(err?.response?.data?.message || "An unexpected error occurred");
          setLoading(false);
        }
      };

      fetchOrders();
    } else {
      setError("User not found");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerIntervals = {};

    // Only start timers for orders with time remaining > 0
    Object.keys(timers).forEach(orderId => {
      const orderTimer = timers[orderId];
      
      if (orderTimer && orderTimer.timeRemaining > 0) {
        timerIntervals[orderId] = setInterval(() => {
          setTimers(prevTimers => {
            const newTimeRemaining = prevTimers[orderId].timeRemaining - 1;
            
            // If the time is up, clear the timer
            if (newTimeRemaining <= 0) {
              clearInterval(timerIntervals[orderId]);
              return {
                ...prevTimers,
                [orderId]: { ...prevTimers[orderId], timeRemaining: 0 }
              };
            }
            
            // Otherwise, update the time remaining
            return {
              ...prevTimers,
              [orderId]: { ...prevTimers[orderId], timeRemaining: newTimeRemaining }
            };
          });
        }, 1000);
      }
    });

    return () => {
      // Clear all timers on component unmount
      Object.values(timerIntervals).forEach(clearInterval);
    };
  }, [timers]);

  const handleFilterChange = (status) => {
    setFilter(status);
    if (status === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === status));
    }
  };

  const closePopup = () => {
    setError(null); 
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await cancelOrder(orderId); // Call the API service function
      alert(response);
      const updatedOrders = orders.map(order => 
        order.orderId === orderId ? { ...order, status: 'CANCELLED' } : order
      );
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    } catch (err) {
      const errorMsg = err?.message || "Failed to cancel the order";
      setError(errorMsg);
    }
  };

  return (
    <div className="user-order-page">
      <Popup message={error} onClose={closePopup} />
      <div className="filter-buttons">
        <button onClick={() => handleFilterChange('ALL')} className={filter === 'ALL' ? 'active' : ''}>All</button>
        <button onClick={() => handleFilterChange('PENDING')} className={filter === 'PENDING' ? 'active' : ''}>Pending</button>
        <button onClick={() => handleFilterChange('ONGOING')} className={filter === 'ONGOING' ? 'active' : ''}>Ongoing</button>
        <button onClick={() => handleFilterChange('COMPLETED')} className={filter === 'COMPLETED' ? 'active' : ''}>Completed</button>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p>No orders found for the selected filter.</p>
      ) : (
        <div className="order-list">
          {filteredOrders.map((order, index) => (
            <div key={index} className="order-card">
              <h2>{order.restaurantName}</h2>
              <p><strong>Status: {order.status}</strong></p>
              {order.status === 'PENDING' && timers[order.orderId]?.timeRemaining > 0 ? (
                <div className="cancel-section">
                  <button onClick={() => handleCancelOrder(order.orderId)}>Cancel Order</button>
                  <p>Time left to cancel: {timers[order.orderId].timeRemaining}s</p>
                </div>
              ) : (
                <p>Cannot cancel order</p>
              )}
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

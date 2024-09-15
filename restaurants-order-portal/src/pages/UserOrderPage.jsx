import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserOrders, cancelOrder, contactSupport } from '../services/apiService';
import Popup from '../components/Popup';
import ContactSupportPopup from '../components/ContactSupportPopup';
import AppBar from '../components/AppBar'; 
import '../styles/UserOrderPage.css';

const UserOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [contactOrder, setContactOrder] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const navigate = useNavigate();

  const user = useMemo(() => JSON.parse(localStorage.getItem('user')), []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await getUserOrders(user.userId);
        setOrders(data);
        setFilteredOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err?.response?.data?.message || 'An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

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
    setSuccessMessage(null);
    setShowContactPopup(false);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      setSuccessMessage('Order cancelled successfully');
      const updatedOrders = orders.map(order =>
        order.orderId === orderId ? { ...order, status: 'CANCELLED' } : order
      );
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Failed to cancel the order';
      setError(errorMsg);
    }
  };

  const calculateRemainingTime = (orderDate) => {
    const now = new Date();
    const orderTime = new Date(orderDate);
    const timeDifferenceInSeconds = 30 - Math.floor((now - orderTime) / 1000);
    return timeDifferenceInSeconds > 0 ? timeDifferenceInSeconds : 0;
  };

  const Timer = ({ orderDate, onExpire }) => {
    const [remainingTime, setRemainingTime] = useState(calculateRemainingTime(orderDate));

    useEffect(() => {
      const timerInterval = setInterval(() => {
        const newRemainingTime = calculateRemainingTime(orderDate);
        setRemainingTime(newRemainingTime);

        if (newRemainingTime === 0) {
          clearInterval(timerInterval);
          onExpire();
        }
      }, 1000);

      return () => clearInterval(timerInterval);
    }, [orderDate, onExpire]);

    return <span className="timer">Time left to cancel: {remainingTime} seconds</span>;
  };

  const handleContactSupport = (order) => {
    setContactOrder(order);
    setShowContactPopup(true);
  };

  const submitContactForm = async ({ subject, message }) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const fromEmail = storedUser.email;
    const contactData = {
      restaurantEmail: contactOrder.restaurantEmail,
      subject,
      message,
      fromEmail,
    };

    try {
      setIsSending(true);
      await contactSupport(contactData);
      setSuccessMessage('Support contacted successfully');
      setIsSending(false);
      setShowContactPopup(false); 
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to contact support');
      setIsSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="users-orders-page">
      <AppBar user={user} handleLogout={handleLogout} />
      <div className="user-order-page">
      {(error || successMessage) && (
        <Popup message={error || successMessage} onClose={closePopup} />
      )}
      {showContactPopup && (
        <ContactSupportPopup
          order={contactOrder}
          onClose={() => setShowContactPopup(false)}
          onSubmit={submitContactForm}
          isSending={isSending}
        />
      )}

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
              {order.status === 'PENDING' && calculateRemainingTime(order.orderTime) > 0 ? (
                <>
                  <Timer
                    orderDate={order.orderTime}
                    onExpire={() => setOrders(orders.map(o => o.orderId === order.orderId ? { ...o, status: 'EXPIRED' } : o))}
                  />
                  <button onClick={() => handleCancelOrder(order.orderId)}>Cancel Order</button>
                </>
              ) : (
                <p>Cannot cancel order</p>
              )}

              <button onClick={() => handleContactSupport(order)}>Contact Support</button>

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
    </div>
  );
};

export default UserOrderPage;

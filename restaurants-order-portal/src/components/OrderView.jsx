import React, { useEffect, useState } from 'react';
import { getRestaurantOrders } from '../services/apiService';
import Popup from './Popup';
import '../styles/OrdersView.css';

const OrdersView = ({ restaurantId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getRestaurantOrders(restaurantId);
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError(true);
        setErrorMessage(err.response?.data?.message || 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [restaurantId]);

  const handleClosePopup = () => {
    setError(false);
    setErrorMessage('');
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="orders-view">
      {error && <Popup message={errorMessage} onClose={handleClosePopup} />}
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="order-card">
            <h3>Order by User ID: {order.userId}</h3>
            <p><strong>Delivery Address:</strong> {order.address}</p>
            <div className="order-details">
              {order.orderDetailList.map((detail, i) => (
                <div key={i} className="order-detail">
                  <p><strong>Order Detail ID:</strong> {detail.orderDetailId}</p>
                  <p><strong>Food ID:</strong> {detail.foodId}</p>
                  <p><strong>Quantity:</strong> {detail.quantity}</p>
                  <p><strong>Price:</strong> ${detail.price}</p>
                </div>
              ))}
            </div>
            <button className="update-order-btn">Update Order</button>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersView;

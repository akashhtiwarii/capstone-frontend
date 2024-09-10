import React, { useEffect, useState } from 'react';
import { getRestaurantOrders } from '../services/apiService';
import Popup from './Popup';
import '../styles/OrdersView.css';

const OrdersView = ({ restaurantId }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getRestaurantOrders(restaurantId);
        setOrders(data);
        setFilteredOrders(data);
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

  useEffect(() => {
    if (filter === 'ALL') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => order.status === filter);
      setFilteredOrders(filtered);
    }
  }, [filter, orders]);

  const handleClosePopup = () => {
    setError(false);
    setErrorMessage('');
  };

  const handleFilterChange = (status) => {
    setFilter(status);
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="orders-view">
      {error && <Popup message={errorMessage} onClose={handleClosePopup} />}
      <div className="filter-buttons">
        <button className={filter === 'ALL' ? 'active' : ''} onClick={() => handleFilterChange('ALL')}>All</button>
        <button className={filter === 'PENDING' ? 'active' : ''} onClick={() => handleFilterChange('PENDING')}>Pending</button>
        <button className={filter === 'ONGOING' ? 'active' : ''} onClick={() => handleFilterChange('ONGOING')}>Ongoing</button>
        <button className={filter === 'COMPLETED' ? 'active' : ''} onClick={() => handleFilterChange('COMPLETED')}>Completed</button>
      </div>
      {filteredOrders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        filteredOrders.map((order, index) => (
          <div key={index} className="order-card">
            <h3>Order by User ID: {order.userId}</h3>
            <p><strong>Delivery Address:</strong> {order.address}</p>
            <p><strong>Order Status:</strong> {order.status}</p>
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

import React, { useEffect, useState } from 'react';
import { getRestaurantOrders, updateOrderStatus } from '../services/apiService'; 
import Popup from './Popup';
import '../styles/OrdersView.css';

const OrdersView = ({ restaurantId }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getRestaurantOrders(restaurantId);
        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError(true);
        setPopupMessage(err.response?.data?.message || 'An unknown error occurred.');
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
    setPopupMessage('');
  };

  const handleFilterChange = (status) => {
    setFilter(status);
  };

  const handleUpdateOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleStatusChange = async () => {
    if (newStatus && selectedOrder) {
      try {
        const response = await updateOrderStatus({
          ownerId: selectedOrder.userId,
          orderId: selectedOrder.orderId,
          status: newStatus,
        });
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.orderId === selectedOrder.orderId ? { ...order, status: newStatus } : order
          )
        );
        setPopupMessage(response.message || 'Order updated successfully');
        setSelectedOrder(null);
      } catch (err) {
        console.error('Failed to update order:', err);
        setError(true);
        setPopupMessage(err.response?.data?.message || 'Failed to update the order.');
      }
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="orders-view">
      {popupMessage && <Popup message={popupMessage} onClose={handleClosePopup} />}
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
            <h3>Order ID: {order.orderId}</h3>
            <h3>Order by: {order.userName}</h3>
            <p><strong>Delivery Address:</strong> {order.address}</p>
            <p><strong>Order Status:</strong> {order.status}</p>
            <div className="order-details">
              {order.orderDetailOutDTOS.map((detail, i) => (
                <div key={i} className="order-detail">
                  <p><strong>Food:</strong> {detail.foodName}</p>
                  <p><strong>Quantity:</strong> {detail.quantity}</p>
                  <p><strong>Price:</strong> ${detail.price}</p>
                </div>
              ))}
            </div>
            {selectedOrder && selectedOrder.orderId === order.orderId ? (
              <div className="update-status">
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="">Select Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <button onClick={handleStatusChange} className = "update-status-save-btn">Save</button>
                <button onClick={() => setSelectedOrder(null)} className = "update-status-cancel-btn">Cancel</button>
              </div>
            ) : (
              <button className="update-order-btn" onClick={() => handleUpdateOrder(order)}>Update Order</button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersView;

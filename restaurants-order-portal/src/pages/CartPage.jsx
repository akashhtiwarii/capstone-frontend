import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup';
import { getCartItems } from '../services/apiService'; 
import '../styles/CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  
  const user = useMemo(() => JSON.parse(localStorage.getItem('user')), []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        const data = await getCartItems(user.userId);
        setCartItems(data);
      } catch (error) {
        setErrorMessage(error.message || 'Failed to load cart items.');
      }
    };

    fetchCart();
  }, [navigate, user]);

  const handleClosePopup = () => {
    setErrorMessage(null);
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length > 0 ? (
        <ul className="cart-list">
          {cartItems.map((item) => (
            <li key={item.cartItemId} className="cart-item">
              <p>Food ID: {item.foodId}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
      {errorMessage && <Popup message={errorMessage} onClose={handleClosePopup} />}
    </div>
  );
};

export default CartPage;

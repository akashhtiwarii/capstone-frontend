import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup';
import { 
  getCartItems, 
  deleteCartItemById, 
  updateCartItemQuantity, 
  placeOrder 
} from '../services/apiService';
import '../styles/CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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

  const handleDelete = async (cartItemId) => {
    try {
      await deleteCartItemById(cartItemId);
      setCartItems(cartItems.filter(item => item.cartItemId !== cartItemId));
    } catch (error) {
      setErrorMessage(error.message || 'Failed to delete cart item.');
    }
  };

  const handleQuantityChange = async (cartItemId, delta) => {
    const item = cartItems.find(item => item.cartItemId === cartItemId);
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return; 

    try {
      await updateCartItemQuantity(cartItemId, delta);
      setCartItems(cartItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update cart item quantity.');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const result = await placeOrder(user.userId);
      setSuccessMessage(result);
      setCartItems([]); 
    } catch (error) {
      setErrorMessage(error.message || 'Failed to place order.');
    }
  };

  const handleClosePopup = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length > 0 ? (
        <ul className="cart-list">
          {cartItems.map((item) => (
            <li key={item.cartItemId} className="cart-item">
              <div className="item-details">
                <p>Restaurant Name: {item.restaurantName}</p>
                <p>Food Item: {item.foodName}</p>
                <p>Price: ₹{item.price}</p>
              </div>
              <div className="item-actions">
                <button onClick={() => handleDelete(item.cartItemId)} className="delete-button">Delete</button>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(item.cartItemId, -1)} className="quantity-button">-</button>
                  <p>Quantity: {item.quantity}</p>
                  <button onClick={() => handleQuantityChange(item.cartItemId, 1)} className="quantity-button">+</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
      {cartItems.length > 0 && (
        <button onClick={handlePlaceOrder} className="place-order-button">Place Order</button>
      )}
      {(errorMessage || successMessage) && (
        <Popup message={errorMessage || successMessage} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default CartPage;

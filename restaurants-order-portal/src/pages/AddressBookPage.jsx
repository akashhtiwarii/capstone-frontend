import React, { useEffect, useState } from 'react';
import { getAddressList, deleteAddress, updateAddress, addAddress } from '../services/apiService';
import Popup from '../components/Popup';
import '../styles/AddressBookPage.css';
import { useNavigate } from 'react-router-dom';
import AppBar from '../components/AppBar';

const AddressBookPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  
  const fetchAddresses = async () => {
    if (!user) {
      setErrorMessage('User not found.');
      return;
    }

    try {
      const data = await getAddressList(user.userId);
      setAddresses(data);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to load addresses.');
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user?.userId]); 

  const handleDelete = async (addressId) => {
    try {
      await deleteAddress(user.userId, addressId);
      setAddresses(addresses.filter((address) => address.addressId !== addressId));
      setSuccessMessage('Address deleted successfully');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to delete address.');
    }
  };

  const handleUpdateClick = (address) => {
    setCurrentAddress(address);
    setFormData({
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setIsUpdating(true);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setCurrentAddress(null);
    setFormData({
      address: '',
      city: '',
      state: '',
      pincode: '',
    });
    setIsUpdating(false);
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setErrorMessage('User not found.');
      return;
    }

    try {
      if (isUpdating) {
        await updateAddress({
          userId: user.userId,
          addressId: currentAddress.addressId,
          ...formData,
          pincode: parseInt(formData.pincode, 10),
        });
        setSuccessMessage('Address updated successfully');
      } else {
        await addAddress({
          userId: user.userId,
          ...formData,
          pincode: parseInt(formData.pincode, 10),
        });
        setSuccessMessage('Address added successfully');
      }

      setShowForm(false);
      await fetchAddresses(); 
    } catch (error) {
      setErrorMessage(error.response || 'Failed to save address.');
    }
  };

  const handleClosePopup = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="addresses-book-page">
      <AppBar user={user} handleLogout={handleLogout} />
      <div className="address-book-page">
      <h2>Your Address Book</h2>
      <button className="add-address-button" onClick={handleAddClick}>Add Address</button>
      {addresses.length > 0 ? (
        <ul className="address-list">
          {addresses.map((address) => (
            <li key={address.addressId} className="address-item">
              <p>{`${address.address}, ${address.city}, ${address.state} - ${address.pincode}`}</p>
              <button className="update-button" onClick={() => handleUpdateClick(address)}>Update</button>
              <button className="delete-button" onClick={() => handleDelete(address.addressId)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No addresses found.</p>
      )}
      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                required
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleFormChange}
                required
              />
            </label>
            <label>
              State:
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleFormChange}
                required
              />
            </label>
            <label>
              Pincode:
              <input
                type="number"
                name="pincode"
                value={formData.pincode}
                onChange={handleFormChange}
                required
              />
            </label>
            <button type="submit" className="submit-button">{isUpdating ? 'Update Address' : 'Add Address'}</button>
            <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}
      {(errorMessage || successMessage) && (
        <Popup message={errorMessage || successMessage} onClose={handleClosePopup} />
      )}
    </div>
    </div>
  );
};

export default AddressBookPage;

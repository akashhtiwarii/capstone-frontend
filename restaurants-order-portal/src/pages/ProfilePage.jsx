import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfilePage.css';
import { getUserProfile, rechargeWallet, updateUserProfile } from '../services/apiService';
import Popup from '../components/Popup';
import AppBar from '../components/AppBar'; // Import AppBar

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const user = JSON.parse(storedUser);

  useEffect(() => {
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(user.userId);
        setProfile(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(true);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.userId, navigate, storedUser]);

  const handleEditToggle = async () => {
    if (isEditing) {
      const { walletAmount, ...profileData } = profile;

      try {
        const response = await updateUserProfile(user.userId, profileData);
        setPopupMessage(response.message);
        setIsEditing(false);  
      } catch (err) {
        console.error('Error updating profile:', err);
        const errorMessages = err.response?.data
          ? Object.values(err.response.data).join(', ')
          : 'Failed to update profile';

        setPopupMessage(errorMessages);
      }
    } else {
      setIsEditing(true); 
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleRechargeWallet = async () => {
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) {
      setPopupMessage('Please enter a valid amount.');
      return;
    }

    try {
      const response = await rechargeWallet(user.userId, amount);
      setPopupMessage(response.message);
      setProfile({ ...profile, walletAmount: profile.walletAmount + amount });
      setRechargeAmount('');
    } catch (err) {
      console.error('Error recharging wallet:', err);
      setPopupMessage('Failed to recharge wallet.');
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>There was an error loading the profile.</p>;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="user-profile-page">
      {user.role === 'USER' && <AppBar user={user} handleLogout={handleLogout} />}
      <div className="profile-page">
      <Popup message={popupMessage} onClose={() => setPopupMessage('')} />
      {profile && (
        <div className="profile-details">
          <div className="profile-field">
            <strong>Name:</strong>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.name}</span>
            )}
          </div>
          <div className="profile-field">
            <strong>Email:</strong>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.email}</span>
            )}
          </div>
          <div className="profile-field">
            <strong>Phone:</strong>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.phone}</span>
            )}
          </div>
          {user.role !== 'OWNER' && (
            <>
              <div className="profile-field">
                <strong>Wallet Amount:</strong>
                <span>₹{profile.walletAmount.toFixed(2)}</span>
              </div>
              <div className="recharge-wallet">
                <input
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  placeholder="Enter amount"
                />
                <button className="recharge-button" onClick={handleRechargeWallet}>
                  Recharge Wallet
                </button>
              </div>
            </>
          )}
          <button className="edit-button" onClick={handleEditToggle}>
            {isEditing ? 'Save Changes' : 'Update Profile'}
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default ProfilePage;

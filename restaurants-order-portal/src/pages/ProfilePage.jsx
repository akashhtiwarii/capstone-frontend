import React, { useState, useEffect } from 'react';
import '../styles/ProfilePage.css';
import { useParams } from 'react-router-dom';
import { getUserProfile, rechargeWallet } from '../services/apiService';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');

  const { userId } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(userId);
        setProfile(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleRechargeWallet = async () => {
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    try {
      const response = await rechargeWallet(userId, amount);
      alert(response);
      setProfile({ ...profile, walletAmount: profile.walletAmount + amount });
      setRechargeAmount('');
    } catch (err) {
      console.error('Error recharging wallet:', err);
      alert('Failed to recharge wallet.');
    }
  };

  const maskPassword = (password) => {
    return password ? '•'.repeat(password.length) : '';
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>There was an error loading the profile.</p>;

  return (
    <div className="profile-page">
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
            <strong>Password:</strong>
            <span>{maskPassword(profile.password)}</span>
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
          <div className="profile-field">
            <strong>Role:</strong>
            <span>{profile.role}</span>
          </div>
          <div className="profile-field">
            <strong>Address:</strong>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.address}</span>
            )}
          </div>
          <div className="profile-field">
            <strong>City:</strong>
            {isEditing ? (
              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.city}</span>
            )}
          </div>
          <div className="profile-field">
            <strong>Pincode:</strong>
            {isEditing ? (
              <input
                type="number"
                name="pincode"
                value={profile.pincode}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.pincode}</span>
            )}
          </div>
          <div className="profile-field">
            <strong>State:</strong>
            {isEditing ? (
              <input
                type="text"
                name="state"
                value={profile.state}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.state}</span>
            )}
          </div>
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
          <button className="edit-button" onClick={handleEditToggle}>
            {isEditing ? 'Save Changes' : 'Update Profile'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

import React from 'react';
import Signup from '../components/Auth/Signup';

const SignupPage = () => {
  const handleSignup = (data) => {
  };

  return (
    <div className="signup-page">
      <Signup onSignup={handleSignup} />
    </div>
  );
};

export default SignupPage;

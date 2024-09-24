export const validateSignup = (data) => {
  const errors = {};
  if (!/^[A-Za-z\s]+$/.test(data.name)) {
    errors.name = 'Name can only contain letters and spaces';
  }
  if (!/^\S+@gmail\.com$/.test(data.email)) {
    errors.email = 'Valid email required';
  }
  if (data.password.length < 8 || !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/.test(data.password)) {
    errors.password = 'Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character';
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }
  if (!/^[9876]\d{9}$/.test(data.phone)) {
    errors.phone = 'Phone number should be valid';
  }
  if (!['USER', 'OWNER'].includes(data.role)) {
    errors.role = 'Role is mandatory';
  }
  return errors;
};

export const validateLogin = (data) => {
  const errors = {};
  if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = 'Valid email required';
  }
  if (!data.password) {
    errors.password = 'Password cannot be empty';
  }
  return errors;
};

export const validateRestaurant = (data) => {
  const errors = {};

  if (!data.name || !/^[A-Za-z\s]+$/.test(data.name)) {
    errors.name = 'Enter a valid name for restaurant';
  }

  if (!data.email || !/^\S+@gmail\.com$/.test(data.email)) {
    errors.email = 'Enter a valid email ID for restaurant';
  }

  if (!data.phone || !/^[9876]\d{9}$/.test(data.phone)) {
    errors.phone = 'Phone number should be valid';
  }

  if (!data.address || data.address.trim().length === 0) {
    errors.address = 'Address for restaurant cannot be empty';
  }

  return errors;
};

export const validateFoodItem = (data) => {
  const errors = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Valid Name required';
  }

  if (!data.price || data.price <= 0) {
    errors.price = 'Valid Price required';
  }

  if (!data.categoryId || data.categoryId < 1) {
    errors.categoryId = 'Valid Category ID required';
  }

  return errors;
};

export const validateProfileUpdate = (data) => {
  const errors = {};

  if (!/^[a-zA-Z\s'-]{2,50}$/.test(data.name)) {
    errors.name = 'A valid name is mandatory';
  }
  if (!/^[\\w.%+-]+@gmail\\.com$/.test(data.email)) {
    errors.email = 'Valid Email not found';
  }
  if (!/^[9876]\\d{9}$/.test(data.phone)) {
    errors.phone = 'Phone number should be valid';
  }
  if (!data.address || data.address.trim() === '') {
    errors.address = 'Address cannot be empty';
  }
  if (!data.city || data.city.trim() === '') {
    errors.city = 'City cannot be empty';
  }
  if (!/^\d{6}$/.test(data.pincode)) {
    errors.pincode = 'Pincode must be a 6-digit number';
  }
  if (!data.state || data.state.trim() === '') {
    errors.state = 'State cannot be empty';
  }

  return errors;
};


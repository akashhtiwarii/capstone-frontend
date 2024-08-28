export const validateSignup = (data) => {
  const errors = {};
  if (!/^[A-Za-z\s]+$/.test(data.name)) {
    errors.name = 'Name can only contain letters and spaces';
  }
  if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = 'Valid email required';
  }
  if (data.password.length < 8 || !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/.test(data.password)) {
    errors.password = 'Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character';
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }
  if (!/^\d{10}$/.test(data.phone)) {
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

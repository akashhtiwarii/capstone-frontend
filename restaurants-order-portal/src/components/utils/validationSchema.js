import * as yup from 'yup';

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Valid email required')
    .required('Email is mandatory'),
  password: yup
    .string()
    .required('Password cannot be empty'),
});

export const signupValidationSchema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces')
    .required('Name is mandatory'),
  email: yup
    .string()
    .email('Valid email required')
    .required('Email is mandatory'),
  password: yup
    .string()
    .min(8, 'Password should be minimum 8 characters')
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/, 
      'Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character'
    )
    .required('Password is mandatory'),
    confirmPassword: yup
    .string()
    .required('Confirm Password is mandatory')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  phone: yup
    .string()
    .matches(/^\d{10}$/, 'Phone number should be valid')
    .required('Phone number is mandatory'),
  role: yup
    .string()
    .oneOf(['USER', 'OWNER'], 'Role is mandatory')
    .required('Role is mandatory'),
});

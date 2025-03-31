import { useState } from 'react';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    birthDate: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email address';
    if (!formData.birthDate) newErrors.birthDate = 'Date of birth is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      // Convert the birthDate to ISO 8601 format
      const formattedbirthDate = new Date(formData.birthDate).toISOString();

      // Prepare the form data to send
      const dataToSend = {
        ...formData,
        birthDate: formattedbirthDate // Send the formatted date to the backend
      };

      try {
        const response = await fetch('https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net//api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
          const data = await response.json();
          alert(data.message); // Show success message from backend
          // Optionally, you could redirect the user to login here
        } else {
          const error = await response.text();
          alert(error); // Handle error message from backend
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('Registration failed.');
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>

        <div className="input-group">
          <label htmlFor="firstName">First Name</label>
          <input name="firstName" type="text" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="lastName">Last Name</label>
          <input name="lastName" type="text" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input name="username" type="text" placeholder="Username" value={formData.username} onChange={handleChange} />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="birthDate">Date of Birth</label>
          <input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
          {errors.birthDate && <span className="error">{errors.birthDate}</span>}
        </div>

        <p className="login-prompt">
          Already have an account? <a href="/">Log in</a>
        </p>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

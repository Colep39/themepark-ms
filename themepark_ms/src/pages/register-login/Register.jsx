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
    dob: ''
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
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      alert('Registration successful!');
      // Handle submission (e.g., send to server)
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
        <label htmlFor="dob">Date of Birth</label>
        <input name="dob" type="date" value={formData.dob} onChange={handleChange} />
        {errors.dob && <span className="error">{errors.dob}</span>}
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

import "./Login.css";
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from '../../UserContext'; // adjust path as needed

const Login = () => {

  const { setRole } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate the form fields
  const validate = () => {
    let tempErrors = { username: '' };
    let isValid = true;

    if (!formData.username) {
      tempErrors.username = 'Name is required';
      isValid = false;
    }
    if (!formData.password) {
      tempErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await fetch('https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net//api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);  // Store the JWT token
          localStorage.setItem('role', data.role);    // Store the user role
          setRole(data.role);

          // Navigate based on user role
          switch (data.role) {
            case 'Admin':
              navigate('/adminpage');
              break;
            case 'Staff':
              navigate('/managerides');
              break;
            case 'Visitor':
              navigate('/home');
              break;
            default:
              navigate('/');
          }
        } else {
          const error = await response.text();
          alert(error);  // Handle invalid credentials
        }
      } catch (error) {
        alert('Login failed.');
      }
    }
  };

  return (
    <div id="login-wrapper">
      <form onSubmit={handleSubmit} className="login-page" id="loginform">
        <div className="login-container">
          <div className="heading">Sign In</div>
          <div className="form"> {/* ← Just use a div here */}
            <input
              className="input"
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
            />
            {errors.username && <span style={{ color: 'red' }}>{errors.username}</span>}

            <input
              className="input"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}

            <span className="no-account">
              No account? <Link to="/register" id="register-text">Register</Link>
            </span>

            <input className="login-button" type="submit" value="Sign In" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;

import "./Login.css";
import { useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const Login = () => {
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
      if(!formData.password){
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
        // Handle form submission (e.g., API call)
        try {
          /*
          const res = await fetch("http://localhost:5000", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          });
    
          if (!res.ok) {
            throw new Error("Invalid credentials");
          }
    
          const data = await res.json();
          */
          const data = {
            role: 'Admin'
          }
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
    
          // Navigate to the correct dashboard
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
    
        } catch (error) {
          alert(error.message);
        }
        console.log('Form submitted:', formData);
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
    )
}

export default Login;
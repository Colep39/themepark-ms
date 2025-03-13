import "./Login.css";
import { useState } from 'react';

const Login = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
    });
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
    let tempErrors = { name: '', email: '' };
    let isValid = true;

    if (!formData.name) {
      tempErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email) {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email is invalid';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Handle form submission (e.g., API call)
      console.log('Form submitted:', formData);
    }
  };
    return ( 
    <div id="login-wrapper">
      <img src="src/images/pool-water-background.jpg" alt="background-image" id="login-image"/>
      <form onSubmit={handleSubmit} className="login-page" id="loginform">
              {/*<!-- From Uiverse.io by Smit-Prajapati --> */}
              <div className="login-container">
                  <div className="heading">Sign In</div>
                  <form action="" className="form">
                  <input required="" className="input" type="text" name="username" id="username" placeholder="Username" value={formData.username} onChange={handleInputChange}/>
                  {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
                  <input required="" className="input" type="password" name="password" id="password" placeholder="Password" value={formData.password} onChange={handleInputChange}/>
                  {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
                  <span className="no-account">No account? <a href="/register" id="register-text">Register</a></span>
                  <input className="login-button" type="submit" value="Sign In"></input>
                  
                  </form>
              </div>
      </form>
    </div>
    )
}

export default Login;
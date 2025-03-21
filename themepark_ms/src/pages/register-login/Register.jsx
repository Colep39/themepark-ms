import "./Register.css";
import { useState } from 'react';

const Register = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        b_date: '',
    });
    const [errors, setErrors] = useState({
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        b_date: '',
    });
  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate the form fields
  const validate = () => {
    let tempErrors = { firstname: '', lastname:'', email: '', username: '', password: '', confirmPassword: '', b_date: '' };
    let isValid = true;

    if (!formData.firstname) {
      tempErrors.firstname = 'First Name is required';
      isValid = false;
    }
    if (!formData.lastname){
        tempErrors.lastname = 'Last Name is required';
        isValid = false;
    }

    if (!formData.email) {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email is invalid';
      isValid = false;
    }
    if(!formData.username){
      tempErrors.username = 'Username is required';
      isValid = false;
    } else if(formData.username.length <= 6){
      tempErrors.username = 'Username must be at least 7 characters';
      isValid = false;
    }
    
    if(!formData.password){
      tempErrors.password = 'Password is required';
      isValid = false;
    } else if(formData.password.length < 8){
      tempErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if(!formData.confirmPassword){
      tempErrors.confirmPassword = 'You must confirm your password';
      isValid = false;
    } 
    if(formData.confirmPassword === formData.password && formData.confirmPassword){
      console.log('passwords match')
    }
    else{
      tempErrors.confirmPassword = 'The entered passwords must match';
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
    <form onSubmit={handleSubmit} className="login-page" id="register-page">
            {/*<!-- From Uiverse.io by Smit-Prajapati --> */}
            <div className="login-container" id="register-container">
                <div className="heading" id="register-heading">Register</div>
                <div className="form">
                    <div className="error-message">{errors.firstname && <span style={{ color: 'red', fontSize:'14px' }}>{errors.firstname}</span>}</div>
                    <input required="" className="input" type="text" name="firstname" id="register-firstname" placeholder="John" value={formData.firstname} onChange={handleInputChange}/>
                    <div className="error-message">{errors.lastname && <span style={{ color: 'red', fontSize:'14px' }}>{errors.lastname}</span>}</div> 
                    <input required="" className="input" type="text" name="lastname" id="register-lastname" placeholder="Barnes" value={formData.lastname} onChange={handleInputChange}/>
                    <div className="error-message">{errors.username && <span style={{ color: 'red', fontSize:'14px' }}>{errors.username}</span>}</div> 
                    <input required="" className="input" type="text" name="username" id="username" placeholder="Username" value={formData.username} onChange={handleInputChange}/>
                    <div className="error-message">{errors.password && <span style={{ color: 'red', fontSize:'14px'}}>{errors.password}</span>}</div> 
                    <input required="" className="input" type="password" name="password" id="password" placeholder="Password" value={formData.password} onChange={handleInputChange}/>
                    <div className="error-message">{errors.confirmPassword && <span style={{color: 'red', fontSize:'14px'}}>{errors.confirmPassword}</span>}</div> 
                    <input required="" className="input" type="password" name="confirmPassword" id="register-confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} />
                    <div className="error-message">{errors.email && <span style={{color: 'red', fontSize:'14px'}}>{errors.email}</span>}</div> 
                    <input required="" className="input" type="email" name="email" id="register-email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
                    <div className="error-message">{errors.b_date && <span style={{color: 'red', fontSize:'14px'}}>{errors.b_date}</span>}</div>
                    <input required="" className="input" type="date" name="b_date" id="b_date" placeholder="Date of Birth" value={formData.b_date} onChange={handleInputChange} />
                    <span className="no-account" id="already-registered">Already Registered? <a href="/" id="register-text">Log In</a></span>
                    <input className="login-button" type="submit" value="Create Account" id="create-account-btn" onClick={handleSubmit}></input>
                </div>
            </div>
    </form>
    )
}

export default Register;
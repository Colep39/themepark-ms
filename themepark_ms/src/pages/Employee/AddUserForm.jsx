import './AddUserForm.css';
import { useState } from 'react';
import PropTypes from "prop-types";


export default function AddUserForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    birth_date: "",
    username: "",
    password: "",
    role: "Visitor"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <input name="first_name" placeholder="First Name" onChange={handleChange} required />
          <input name="last_name" placeholder="Last Name" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="birth_date" type="date" placeholder="Date of Birth" onChange={handleChange} required />
          <input name="username" placeholder="Username" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <select name="role" onChange={handleChange} value={formData.role}>
            <option value="Staff">Staff</option>
            <option value="Visitor">Visitor</option>
          </select>
          <div className="modal-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddUserForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };
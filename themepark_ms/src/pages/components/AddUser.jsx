import { useState } from 'react';
import PropTypes from "prop-types";

export default function AddUserForm({ onClose }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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

    // Map to C# field names
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      birth_date: formData.birth_date,
      username: formData.username,
      password: formData.password,
      role: formData.role
    };

    try {
      const response = await fetch("https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net//api/users", {  // Change to your API URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`  // If using JWT auth
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("User added successfully!");
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to add user"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="birthDate"
            type="date"
            value={formData.birth_date}
            onChange={handleChange}
            required
          />
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
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
};
